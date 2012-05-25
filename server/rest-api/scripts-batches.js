/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var routingConfig = require("./routing-config.js"),
    BSON = require('mongodb').BSONPure;

module.exports = function(scriptsBatchesProvider) {
    var app = express.createServer();

    app.mounted(function(otherApp) {
        console.info("[scripts-batches] express app was mounted.");
    });

    /**
     * GETs all the available scripts batches
     */
    app.get("/", routingConfig.provides('json', '*/*'), function(req, res, next) {
        var err;
        if (err) return next(new Error(err));

        scriptsBatchesProvider.findAll({sort: ["name", "asc"]}, function(err, scriptsBatches) {
            if (err) return next(new Error(err));

            res.send(scriptsBatches);
        });
    });

    app.post("/", routingConfig.provides('json', '*/*'), function(req, res, next) {
        var body = req.body;

        if (!body) {
            res.statusCode = 400;
            return next(new Error("The request must contain a body!"));
        }

        body = parseObjectIds(body);

        scriptsBatchesProvider.upsert(body, function(err, object) {
            if (err) return next(new Error(err));

            res.send(object);
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
