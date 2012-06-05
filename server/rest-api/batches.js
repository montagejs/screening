/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
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
