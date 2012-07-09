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

var fs = require('fs');

exports.init = function init(app, agentPool, SCREENING_VERSION) {
    var io = null;

    io = require("socket.io").listen(app, {resource: "/screening/socket.io"});

    io.configure(function() {
        io.set("log level", 1);
        io.set("heartbeat timeout", 5);
        io.set("heartbeat interval", 7);
        io.set("close timeout", 10);
    });

    // TODO: this function should be removed in favor of using the rest-api
    function listAvailableTests() {
        return fs.readdirSync(__dirname + "/../sample_tests/");
    }

    io.sockets.on("connection", function (socket) {
        socket.on("initDriver", function(callback) {
            if(socket.manager.rooms["/drivers"] == null ||
                socket.manager.rooms["/drivers"].indexOf(socket.id) == -1) {
                socket.join("drivers");
            }

            socket.on("disconnect", function (data) {
                // TODO: Do we need to do anything here? I don't think so
            });
            callback(SCREENING_VERSION, agentPool.getAgents(), listAvailableTests());
        });

        socket.on("initRecorder", function(id) {
            var agent = agentPool.getAgentById(id);
            agent.recorderReady(socket);
        });
    });

    // attaching our socket.io port here for control-room communication
    agentPool.io = io;

    return io;
}
