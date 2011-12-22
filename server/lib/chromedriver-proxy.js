/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var httpProxy = require('http-proxy'),
    url = require('url'),
    spawn = require('child_process').spawn;

var host = 'localhost',
    port = 4444, // remote port
    proxyPort = 8888; // local port

var chromedriver = {
    process: null,
    start: function(){
        this.process = spawn(__dirname + '/bin/chromedriver-osx', [
            '--port=' + port
        ]);
        return this;
    },
    stop: function(){
        // Added as stub function.
        // We don't have to kill subprocesses manually
        this.process.kill('SIGHUP');
        return this;
    }
}
// chromedriver.start();

httpProxy.createServer(function(req, res, proxy) {
    var parsedUrl = url.parse(req.url);
    // special handling for chromedriver
    // the base-url of it does not start with '/wd/hub' (default behaviour)
    parsedUrl.pathname = parsedUrl.pathname.replace(/^\/wd\/hub/, "");
    req.url = url.format(parsedUrl);
    
    proxy.proxyRequest(req, res, {
        host: host,
        port: port
    });
}).listen(proxyPort);
