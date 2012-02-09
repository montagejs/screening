/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */

/**
 * Starts up the server defined in server.js
 */

var PORT = 8081;

var path = require("path");
var optimist = require('optimist');
var argv = optimist
    .usage('Usage: $0')
    .describe('debug', 'Run server with debug output enabled')
    .describe('production', 'Run server in production mode')
    .describe('port', 'Override listen port')
    .argv;

if(argv.help) {
    optimist.showHelp();
    process.exit();
}

if(argv.production) {
    process.env.NODE_ENV = "production";
} else {
    process.env.NODE_ENV = "development";
}

if(argv.port) {
    PORT = argv.port;
}

var express = require('express');
var app = express.createServer();
var screening = require('./server.js');
screening.configureServer();
var socketApi = require("./lib/sockets.js");

app.configure(function() {
    app.use("/screening", screening.app);
    
    // Socket.io Initialization
    socketApi.init(app, screening.agentPool, screening.SCREENING_VERSION);
});

app.configure('development', function() {
    var MONTAGE_PATH = path.join(__dirname, "../../node_modules/montage");

    app.use("/node_modules/montage", express.static(MONTAGE_PATH));
    app.use("/node_modules/montage", express.directory(MONTAGE_PATH));
});

app.listen(PORT);
console.log("Screening Server running on port " + PORT + " [" + process.env.NODE_ENV + "]");