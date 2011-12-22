/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var log4js = require("log4js"),
    argv = require("optimist").argv,
    path = require("path");

module.exports = log4js;

module.exports.configure({
    "appenders": [{
        "category": "default",
        "type": "file",
        "filename": "server.log",
        "maxLogSize": 1024,
        "backups": 3,
        "pollInterval": 15
    }, {
        "category": "express",
        "type": "file",
        "filename": "express.log",
        "maxLogSize": 1024,
        "backups": 3,
        "pollInterval": 15
    }, {
        "category": "default",
        "type": "console"
    }, {
        "category": "console",
        "type": "console"
    }],
    "levels": {
        "default": argv.debug ? "DEBUG" : "INFO",
        "express": "INFO"
    }
});

// shortcut to our default
module.exports.log = module.exports.getLogger("default");