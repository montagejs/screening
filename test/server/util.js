/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var spawn = require('child_process').spawn;


var app1;  // variable used to initialize the node server for each test function
var screening = require('../../server/server.js'); // used to initialize the node server
var agentPool = require('../../server/server.js').agentPool;  // used to initialize the node server
var socketApi = require("../../server/lib/sockets.js");  // used to initialize the node server
/**
 *
 * Jasmine helper for handling async-requests
 * through the jasmine-function waitsFor, which
 * waits until true is returned.
 *
 * @param {Function} fn That should be called when the waited callback occurred
 */
exports.waitsForAsync = function(fn) {
    var done = false
    waitsFor(function() {
        return done;
    });
    return function() {
        fn.apply(fn, arguments);
        done = true;
    }
};

exports.initServer = function(port) {
    beforeEach(function() {
        start_server(port);  // function call to initialize the server
        //server.listen(port);
    });

    afterEach(function() {
        //  server.close();
        app1.close();    //close the server after each test function
        this.waits(10);
    });
}

exports.connectPhantomAgent = function(port) {
    var phantomjs = spawn("/Applications/phantomjs.app/Contents/MacOS/phantomjs", [__dirname + "/phantom-agent.js", "http://127.0.0.1:" + port + "/screening/agent/index.html"]);


    var phantomConnected = false;

    runs(function() {
        phantomjs.stdout.on("data", function (data) {
            //console.log(data.toString());
            //if(data.toString().indexOf("WARNING"))
            phantomConnected = true;
        });

        phantomjs.stderr.on("data", function (data) {
            console.log("stderr: " + data.toString());
        });

        phantomjs.on("exit", function (code, signal) {
            if (code !== 0) {
                console.log("phantomjs process exited with code " + code);
            }
        });

        waitsFor(function() {

            return phantomConnected;
        });
    });
    waits(1000); // phantomjs needs some time to get up
    //console.log(phantomjs);
    return phantomjs;
}


// function to start node server at port "PORT", replicating the server start code from server/index.js
function start_server(port) {
    var PORT = port;
    var path = require("path");
    var optimist = require('../../server/node_modules/optimist');

    var argv = optimist
        .usage('Usage: $0')
        .describe('debug', 'Run server with debug output enabled')
        .describe('production', 'Run server in production mode')
        .describe('port', 'Override listen port')
        .argv;

    if (argv.help) {
        optimist.showHelp();
        exit();
    }

    if (argv.production) {
        process.env.NODE_ENV = "production";
    } else {
        process.env.NODE_ENV = "development";
    }

    if (argv.port) {
        PORT = argv.port;
    }

    var express = require('../../server/node_modules/express');

    app1 = express.createServer();

    var mockMongoDbProvider = {
        ensureIndexes: function() {}
    };
    screening.configureServer(mockMongoDbProvider);

    app1.configure(function() {
        app1.use("/screening", screening.app);

        // Socket.io Initialization
        socketApi.init(app1, screening.agentPool, screening.SCREENING_VERSION);
        //socketApi.init(app1, agentPool, screening.SCREENING_VERSION);
    });


    app1.configure('development', function() {
        var MONTAGE_PATH = path.join(__dirname, "../../m-js");
        var APPS_PATH = path.join(__dirname, "/../..");

        app1.use("/m-js", express.static(MONTAGE_PATH));
        app1.use("/m-js", express.directory(MONTAGE_PATH));

        app1.use("/webapps", express.static(APPS_PATH));
        app1.use("/webapps", express.directory(APPS_PATH));
    });

    app1.listen(PORT);
    console.log("Screening Server running on port " + PORT + " [" + process.env.NODE_ENV + "]");
}
