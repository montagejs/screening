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
var friendlyNames = require("./friendly-names.js"),
    color = require("ansi-color").set;

var BaseAgent = exports.BaseAgent = Object.create(Object, {
    init: {
        value: function() {
            this.friendlyName = friendlyNames.getNext();
            return this;
        }
    },

    id: {
        value: null
    },

    friendlyName: {
        value: null
    },

    isBusy: {
        value: false
    },

    capabilities: {
        value: null
    },

    type: {
        value: null
    },

    address: {
        value: null
    },

    runner: {
        value: null
    },

    /**
     * Get a serializable summary of the agent object,
     * @returns JSON serializable object
     */
    getSummary: {
        value: function() {
            var self = this;
            return {
                id: self.id,
                capabilities: self.capabilities,
                friendlyName: self.friendlyName,
                address: self.address,
                isBusy: self.isBusy,
                type: self.type
            }
        }
    },

    /**
     * Signal that a test has started on this agent
     */
    startTest: {
        value: function() {
            this.isBusy = true;
        }
    },

    /**
     * Signal that a test has completed executing on this agent
     *
     * @param {Object} Result of the test execution
     */
    endTest: {
        value: function() {
            this.isBusy = false;
        }
    },

    /**
     * Process a log message returned from the agent
     * @param log Log message to process
     */
    processLog: {
        value: function(log) {
            switch(log.level) {
               case "info":
                    console.log(color("[Info] ", "cyan") + this.friendlyName + " : " + log.message, log.stack || "");
                    break;
               case "warn":
                    console.log(color("[Warn] ", "yellow") + this.friendlyName + " : " + log.message, log.stack || "");
                    //this.socket.broadcast.to("drivers").emit("logMessage", this.socket.id, log);
                    break;
               case "error":
                    console.log(color("[Error] ", "red") + this.friendlyName + " : " + log.message, log.stack || "");
                    //this.socket.broadcast.to("drivers").emit("logMessage", this.socket.id, log);
                    break;
               case "fatal":
                    console.log(color("[Fatal] " + this.friendlyName + " : " + log.message, "red+bold"), log.stack || "");
                    //this.socket.broadcast.to("drivers").emit("logMessage", this.socket.id, log);
                    this.endTest();
                    break;
            }
            if(log.exception && log.exception.stack) {
                console.log(log.exception.stack);
            }
        }
    },

    updateProgress: {
        value: function(count, total) {
        }
    }

});
