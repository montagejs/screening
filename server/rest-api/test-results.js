/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var routingConfig = require("./routing-config.js");

module.exports = function(testcaseResultsProvider) {
    var app = express.createServer();

    app.mounted(function(otherApp) {
        console.info("[test_results] express app was mounted.");
    });

    /**
     * GETs all the available test results
     */
    app.get("/", routingConfig.provides('json', '*/*'), function(req, res, next) {
        var startTimeAfter = req.query["startTimeAfter"];
        var startTimeBefore = req.query["startTimeBefore"];
        var status = req.query["status"];
        var any = req.query["any"];
        var skip = parseInt(req.query["skip"]);
        var limit = parseInt(req.query["limit"]);
        startTimeAfter = Date.parse(startTimeAfter);
        startTimeAfter = isNaN(startTimeAfter) ? undefined : new Date(startTimeAfter);
        startTimeBefore = Date.parse(startTimeBefore);
        startTimeBefore = isNaN(startTimeBefore) ? undefined : new Date(startTimeBefore);

        // Return just the basic properties (no asserts. exceptions or testcase code)
        var justBasicProperties = {asserts:0, "testcase.code":0, exception:0, skip: skip, limit: limit};

        if (startTimeAfter || startTimeBefore) {
            testcaseResultsProvider.findByDateRange(startTimeAfter, startTimeBefore, justBasicProperties,function(err, results) {
                if (err) return next(new Error(err));
                res.send(results);
            });
        } else if (status) {
            var restrictions = {"status": status};
            testcaseResultsProvider.findByRestrictions(restrictions, justBasicProperties, function(err, results) {
                if (err) return next(new Error(err));
                res.send(results);
            });
        } else if (any) {
            console.log('GET all available test results that match "' + any + '" on agent/name/script');
            var restrictions = {"$or": [{"name": new RegExp(any, "i")}, {"agent": new RegExp(any, "i")}, {"testcase.name": new RegExp(any, "i")}]};
            
            testcaseResultsProvider.findByRestrictions(restrictions, justBasicProperties, function(err, results) {
                if (err) return next(new Error(err));
                res.send(results);
            });
        } else {
            console.log('GET all available test results');
            testcaseResultsProvider.findAll(justBasicProperties, function(err, results) {
                if (err) return next(new Error(err));
                res.send(results);
            });
        }
    });

    /**
     * GETs metadata about the testcases.
     * Metadata includes:
     * - count: Total testcases in the database
     */
    app.get("/metadata", routingConfig.provides('json', '*/*'), function(req, res, next) {
        var any = req.query["any"];

        var restrictions = any ? {"$or": [{"name": new RegExp(any, "i")}, {"agent": new RegExp(any, "i")}, {"testcase.name": new RegExp(any, "i")}]} : {};

        testcaseResultsProvider.metadata(restrictions, function(err, result) {
            res.send(result);
        });
    });

    /**
     * GETs the test results for a specific testcaseId
     */
    app.get("/:testId", routingConfig.provides('json', '*/*'), function(req, res, next) {
        var testcaseId = req.params.testId;
        console.log("GET test results for testcaseId: " + testcaseId);

        testcaseResultsProvider.findById(testcaseId, function(err, result) {
            if (err || !result) {
                res.statusCode = 400;
                return next(new Error("testcase with id " + testcaseId + " not found!"));
            }
            // Return 202 if the test has not completed yet
            res.statusCode = result.endTime ? 200 : 202;
            if (req.query.download) {
                res.setHeader("Content-Type", "application/octet-stream");
                res.setHeader("Content-Disposition", "attachment;filename=testresult_" + req.params.testId + ".json");
            }

            res.send(result);
        });
    });

    /**
     * Updates the given testcaseId
     */
    app.put("/:testId", routingConfig.provides('json', '*/*'), function(req, res, next) {
        var testcaseId = req.params.testId;
        console.log("PUT - Update testcaseId: ", testcaseId);

        var body = req.body;
        if (!body) {
            res.statusCode = 400;
            return next(new Error("No body specified in the request"));
        }

        body._id = testcaseId;

        testcaseResultsProvider.upsert(body, function(err, object) {
            if (err) return next(new Error(err));
            res.send(object);
        });
    });

    app.delete("/multiple", routingConfig.provides('json', '*/*'), function(req, res, next) {
        // Expects a body like:
        // {"ids": ["id1", "id2", "id3"]}
        console.log("DELETE - multiple");
        var body = req.body;

        if (!body) {
            res.statusCode = 400;
            return next(new Error("No body specified in the request"));
        }

        var ids = body.ids;

        testcaseResultsProvider.deleteMultipleById(ids, function(err) {
            if (err) return next(new Error(err));
            res.send({ok: true});
        });
    });

    return app;
}