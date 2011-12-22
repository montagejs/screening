/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
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