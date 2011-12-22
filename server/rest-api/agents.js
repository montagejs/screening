/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var path = require('path'),
    routingConfig = require("./routing-config.js");
    express = require('express'),
    simpleRequest = require("request");

module.exports = function(agentPool, testcaseRunner) {
    var app = express.createServer();

    app.mounted(function(otherApp) {
        console.info("[agents] express app was mounted.");
    });

    // TODO: Move this to an appropriate location (Node Module?)
    var stringToBoolean = function(string) {
        switch (string.toLowerCase()) {
            case "true":
            case "yes":
            case "1":
                return true;
            case "false":
            case "no":
            case "0":
            case null:
                return false;
            default:
                return Boolean(string);
        }
    }

    /**
     * GETs all the agents connected to this server
     * Optional params:
     * - include_busy=[true,false] Include the busy agents in the response (default: true)
     * - include_not_busy=[true,false] Include the not busy (available) agents in the response (default: true)
     */
    app.get('/', routingConfig.provides('json', '*/*'), function(req, res) {
        //sys.puts(sys.inspect(agents)); // inspect the agents object
        console.log('GET agents');
        var agentsRes = [];

        var includeBusy = !req.query['include_busy'] ? true : stringToBoolean(req.query['include_busy']);
        var includeNotBusy = !req.query['include_not_busy'] ? true : stringToBoolean(req.query['include_not_busy']);
        var isBusy = (includeBusy && includeNotBusy) ? undefined :
                     (includeBusy && !includeNotBusy) ? true :
                     (!includeBusy && includeNotBusy) ? false : undefined; // setting includeBusy and includeNotBusy to false will render all agents
        res.send(agentPool.getAgents(isBusy));
    });

    app.get("/:id", routingConfig.provides('json', '*/*'), function(req, res, next) {
        console.log('GET agentId: ' + req.params.id);

        var agent = agentPool.getAgentById(req.params.id);

        if (!agent) {
            res.statusCode = 404;
            return next(new Error('agent with id ' + req.params.id + ' does not exist'));
        } else {
            res.send(agent.getSummary());
        }
    });

    /**
     * Execute the code POSTed in the request body
     */
    app.post("/:id/execute_serialized_code", routingConfig.provides('application/json'), function(req, res, next) {
        var body = req.body;
        var agent = agentPool.getAgentById(req.params.id);
        var testcaseId;
        var options = {
            "global._requestOrigin": req.headers && req.headers.origin
        };

        //TODO: Refactor this agentId check in a function
        if (!agent) {
            console.log("Attempted to run test on device that is not connected: " + req.params.id);
            res.statusCode = 404;
            return next(new Error('agent with id ' + req.params.id + ' does not exist'));
        }

        if(!body.code || !body.code.length) {
            console.log("Attempted to run empty test on agent " + req.params.id);
            res.statusCode = 404;
            return next(new Error('Attempted to run empty test on agent ' + req.params.id));
        }

        try {
            testcaseId = testcaseRunner.executeTest(body, {id: req.params.id}, options);
        } catch(ex) {
            console.log("Exception thrown while attempting to run test: " + ex, ex.stack);
            res.statusCode = 404;
            return next(new Error('Exception thrown while attempting to run test: ' + ex));
        }

        // Indicate that the code has started to execute, but that doesn't mean that the code
        // has completed execution, hence the 201
        res.statusCode = 201;
        res.send({testId: testcaseId});
    });

    /**
     * Begin recording on the agent
     */
    app.post("/:id/recording", function(req, res, next) {
        var agent = agentPool.getAgentById(req.params.id);
        var app = req.body;
        var options = {
            "global._requestOrigin": req.headers && req.headers.origin
        };

        if (!agent) {
            console.log("Attempted to record on device that is not connected: " + req.params.id);
            res.statusCode = 404;
            return next(new Error('agent with id ' + req.params.id + ' does not exist'));
        }

        if(!app) {
            console.log("No app specified to record on");
            res.statusCode = 400;
            return next(new Error('No app specified to record on'));
        }

        agent.startRecording(app, options);

        res.writeHead(201, {'Content-Type': 'text/plain'});
        res.end("OK");
    });

    /**
     * Stop recording on the agent
     */
    app.delete("/:id/recording", function(req, res, next) {
        var agent = agentPool.getAgentById(req.params.id);
        var test = req.params.test;
        if (!agent) {
            console.log("Attempted to stop recording on device that is not connected: " + req.params.id);
            res.statusCode = 404;
            return next(new Error('agent with id ' + req.params.id + ' does not exist'));
        }

        var source = agent.stopRecording();
        res.writeHead(200, {'Content-Type': 'application/javascript'});
        res.end(source);
    });

    /**
     * Pause recording on the agent
     */
    app.put("/:id/recording/pause?", function(req, res, next) {
        var agent = agentPool.getAgentById(req.params.id);
        var test = req.params.test;
        if (!agent) {
            console.log("Attempted to pause recording on device that is not connected: " + req.params.id);
            res.statusCode = 404;
            return next(new Error('agent with id ' + req.params.id + ' does not exist'));
        }

        var source = agent.pauseRecording();
        res.writeHead(202, {'Content-Type': 'application/javascript'});
        res.end(source);
    });

    /**
     * Resume recording on the agent
     */
    app.put("/:id/recording/resume?", function(req, res, next) {
        var agent = agentPool.getAgentById(req.params.id);
        var test = req.params.test;
        if (!agent) {
            console.log("Attempted to resume recording on device that is not connected: " + req.params.id);
            res.statusCode = 404;
            return next(new Error('agent with id ' + req.params.id + ' does not exist'));
        }

        var source = agent.resumeRecording();
        res.writeHead(202, {'Content-Type': 'text/plain'});
        res.end("OK");
    });

    /**
     * Add a remote webdriver to our agentpool
     */
    app.post("/webdriver", function(req, res, next) {
        var body = req.body;
        var url = body.url;
        if(!url) {
            console.log("No webdriver URL was passed.");
            res.statusCode = 400;
            return next(new Error('Webdriver base-URL was not passed.'));
        }
        // testing the connected agent
        url = url.replace(/\/$/, "");
        simpleRequest(url + "/status", function (error, response, body) {
            if(error || response.statusCode != 200) {
                var errorMsg = "The webdriver instance referenced by " + url + " can't be accessed.";
                console.log(errorMsg);
                res.statusCode = 400;
                return next(new Error(errorMsg));
            }
            else {
                var agent = agentPool.addAgent({}, {
                    url: url,
                    type: agentPool.agentTypes.WEBDRIVER
                });
                res.statusCode = 201;
                res.send(agent.getSummary());
            }
        });
    });

    app.delete("/:id", routingConfig.provides('json', '*/*'), function(req, res, next) {
        console.log('REMOVE agent with id: ' + req.params.id);

        var agent = agentPool.getAgentById(req.params.id);
        
        if (!agent) {
            res.statusCode = 404;
            return next(new Error('agent with id ' + req.params.id + ' does not exist'));
        } else {
            var summary = agent.getSummary();
            agentPool.removeAgent(req.params.id);
            res.statusCode = 200;
            res.send(summary);
        }
    });
    
    return app;
}
