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
var routingConfig = require("./routing-config.js"),
    express = require("express");

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
        var sort = req.query["sort"];
        var sortDirection = req.query["sort_direction"];
        startTimeAfter = Date.parse(startTimeAfter);
        startTimeAfter = isNaN(startTimeAfter) ? undefined : new Date(startTimeAfter);
        startTimeBefore = Date.parse(startTimeBefore);
        startTimeBefore = isNaN(startTimeBefore) ? undefined : new Date(startTimeBefore);

        // Construct sortFields or default to startTime desc
        var sortFields = [];
        if(sort && sortDirection) {
            sortFields.push([sort, sortDirection]);
        } else if (sort) {
            sortFields.push(sort);
        } else {
            sortFields.push(["startTime", "desc"]);
        }

        // Return just the basic properties (no asserts. exceptions or testcase code)
        var justBasicProperties = {asserts:0, "testcase.code":0, exception:0, skip: skip, limit: limit, sort: sortFields};

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
            res.send({status: "ok"});
        });
    });

    return app;
}
