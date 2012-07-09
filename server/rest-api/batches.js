/* <copyright>
Copyright (c) 2012, Motorola Mobility LLC.
All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of Motorola Mobility LLC nor the names of its
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
</copyright> */
var routingConfig = require("./routing-config.js"),
    BSON = require('mongodb').BSONPure,
    express = require("express");

module.exports = function(batchesProvider) {
    var app = express.createServer();

    app.mounted(function(otherApp) {
        console.info("[batches] express app was mounted.");
    });

    /**
     * GETs all the available batches
     */
    app.get("/", routingConfig.provides('json', '*/*'), function(req, res, next) {
        batchesProvider.findAll({sort: ["name", "asc"]}, function(error, batches) {
            if (error) return next(new Error(error));

            res.send(batches);
        });
    });

    /**
     * GET a batch by its Id
     */
    app.get("/:id", routingConfig.provides('json', '*/*'), function(req, res, next) {
        console.log("GET batches/:id " + req.params.id);

        batchesProvider.findById(req.params.id, function(error, batch) {
            if (error) return next(new Error(error));

            if (!batch) {
                res.statusCode = 400;
                return next({message: "Batch does not exist"});
            }

            res.send(batch);
        });
    });

    /**
     * POSTs a new batch.
     * The objectIds defined in <object>.scripts are converted to MongoDB ObjectIds
     */
    app.post("/", routingConfig.provides('json', '*/*'), function(req, res, next) {
        var body = req.body;

        if (!body) {
            res.statusCode = 400;
            return next(new Error("The request must contain a body!"));
        }

        body = parseObjectIds(body);

        batchesProvider.upsert(body, function(error, batch) {
            if (error) return next(new Error(error));

            res.send(batch);
        });
    });

    /**
     * Updates a batch
     */
    app.put("/:id", routingConfig.provides('json', '*/*'), function(req, res, next) {
        var id = req.params.id;

        var body = req.body;
        if (!body) {
            res.statusCode = 400;
            return next(new Error("Request contained no body"))
        }

        // Add id to body
        body._id = id;
        body.modified = new Date();

        batchesProvider.upsert(body, function(error, batch) {
            if (error) {
                return next(new Error(JSON.stringify(error)));
            }

            res.send(batch);
        });
    });

    /**
     * DELETEs a batch by Id
     */
    app.delete("/:id", routingConfig.provides('json', '*/*'), function(req, res, next) {
        batchesProvider.delete(req.params.id, function(error) {
            if (error) return next(new Error(error));
            res.send({deleted: true});
        });
    });

    /**
     * Identify the ObjectId strings in an object and convert them to actual ObjectIds
     */
    function parseObjectIds(object) {
        var scripts = object.scripts;

        var objectIds = [];
        scripts.forEach(function(script) {
            objectIds.push(new BSON.ObjectID(script));
        });

        object.scripts = objectIds;

        return object;
    }

    return app;
}
