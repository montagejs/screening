/* <copyright>
Copyright (c) 2012, Motorola Mobility, Inc
All Rights Reserved.
BSD License.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

  - Redistributions of source code must retain the above copyright notice,
    this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.
  - Neither the name of Motorola Mobility nor the names of its contributors
    may be used to endorse or promote products derived from this software
    without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
</copyright> */
var BaseAgent = require("./base-agent.js").BaseAgent,
    RecordingCompiler = require("./recording-compiler.js").RecordingCompiler,
    simpleRequest = require("request"),
    createWebdriverSession = require('./agents-webdriver/util.js').createWebdriverSession,
    fs = require("fs"),
    Q = require("q");

var WebDriverAgent = exports.WebDriverAgent = Object.create(BaseAgent, {

    init: {
        value: function(capabilities, url, io) {
            this.io = io;
            BaseAgent.init.apply(this, arguments);
            this.id = this.friendlyName;
            this.address = url;
            this.capabilities = capabilities;
            this.url = url;
            this.io.sockets.in("drivers").emit("agentConnected", this.getSummary());

            this.recordingSession = null;
            this.compiler = Object.create(RecordingCompiler).init();

            return this;
        }
    },

    isAvailable: {
        value: function(cb) {
            simpleRequest(this.url + "/status", function (error, response, body) {
                if(error || response.statusCode != 200) {
                    cb(false);
                }
                else {
                    cb(true);
                }
            });
        }
    },

    url: {
        value: null
    },

    endTest: {
        value: function(result) {
            this.io.sockets.emit("testCompleted", this.id, result);
            BaseAgent.endTest.apply(this, arguments);
        }
    },

    /**
     * Instruct the agent to start monitoring events. Events that it captures will
     * be related to the server for compilation into a executable script
     * @param {string} url Address of app the agent will be recording
     */
    startRecording: {
        value: function(recordingUrl, options) {
            var self = this;

            this.compiler.clearActions();
            this.compiler.pushNavigate(recordingUrl);

            this.isBusy = true;

            var rootUrl = options["global._requestOrigin"];

            if(recordingUrl.indexOf("http") != 0) {
                // prefix the url with the request origin if it is just relative
                recordingUrl = rootUrl + recordingUrl;
            }

            // Start the webdriver session
            var session = this.recordingSession = createWebdriverSession(this.url);
            session.init(this.capabilities, function() {

                // Navigate the new session to the recording URL
                Q.when(session.get(recordingUrl), function() {

                    // Read the recording script
                    fs.readFile(__dirname + "/agents-webdriver/recorder.js", 'utf8', function(err, recordingScript) {
                        if(err) { console.log(err); return; }

                        // Inject the recording script into the page
                        Q.when(session.executeScript(recordingScript, [rootUrl, self.id]), function() {
                            console.log("Waiting for recording socket connection");
                            // When the socket is instantiated it recorderReady will be called.
                        }, function(err) {
                            console.log("Record Script Failed", err.value.message);
                        });
                    });
                });
            });
        }
    },

    recorderReady: {
        value: function(socket) {
            var self = this;
            console.log("Recording socket connected! Starting recording.");
            this.socket = socket;

            socket.on("logMessage", function (log) {
                self.processLog(log);
            });

            // Raised when the agent captures an event while recording. Should be compiled into a script
            socket.on("eventCaptured", function (event) {
                self.compiler.pushEvent(event);
            });

            socket.on("navigateCaptured", function (url) {
                self.compiler.pushNavigate(url);
            });

            socket.on("resizeCaptured", function (width, height) {
                self.compiler.pushResize(width, height);
            });

            socket.emit("startRecord");
            socket.broadcast.to("drivers").emit("recordingStarted", socket.id);
        }
    },

    /**
     * Instruct the agent to stop monitoring events.
     * @returns Compiled script representation of captured events
     */
    stopRecording: {
        value: function(callback) {
            var socket = this.socket;

            if(socket) {
                socket.emit("stopRecord", callback);
                socket.broadcast.to("drivers").emit("recordingCompleted", socket.id);
            }

            this.isBusy = false;

            this.recordingSession.quit();
            this.recordingSession = null;

            return this.compiler.compile();
        }
    },

    /**
     * Instruct the agent to pause monitoring events.
     * @returns Compiled script representation of captured events so far
     */
    pauseRecording: {
        value: function(callback) {
            var socket = this.socket;
            var self = this;

            socket.emit("pauseRecord", callback);

            var compiledScript = this.compiler.compile();
            this.compiler.clearActions();
            return compiledScript;
        }
    },

    /**
     * Instruct the agent to resume monitoring events.
     * @returns Compiled script representation of captured events
     */
    resumeRecording: {
        value: function(callback) {
            var socket = this.socket;
            var self = this;

            socket.emit("resumeRecord", callback);
        }
    }
});
