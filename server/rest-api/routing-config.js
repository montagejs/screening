/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
const apiV1Root = '/api/v1';

exports.init = function(app) {
    const HTTP_200_OK = 200;
    const HTTP_401_UNAUTHORIZED = 401;
    const HTTP_404_NOT_FOUND = 404;
    const HTTP_500_INTERNAL_SERVER_ERROR = 500;

    app.use(apiV1Root, function(req, res, next) {
        var key = req.query['api_key'];

        // key isn't present
        if (!key) {
            res.statusCode = HTTP_401_UNAUTHORIZED;
            return next(new Error('api key required'));
        }

        // key is invalid
        if (!~apiKeys.indexOf(key)) {
            res.statusCode = HTTP_401_UNAUTHORIZED;
            return next(new Error('invalid api key'));
        }

        // all good, store req.key for route access
        req.key = key;
        next();
    });

    app.use(app.router);

    app.use(apiV1Root, function(err, req, res, next) {
        // This middleware is exclusively for errors, so if you forgot to set the
        // statusCode to something other than 200 then it will be defaulted to 500
        if(res.statusCode && res.statusCode === HTTP_200_OK) {
            res.statusCode = HTTP_500_INTERNAL_SERVER_ERROR;
        }
        
        var errorResponse = { error: err.message }
        if(err.stack) {
            errorResponse.stack = err.stack;
        }
        
        res.send(errorResponse, res.statusCode);
    });

    app.use(apiV1Root, function(req, res) {
        res.send({ error: "Resource not found" }, HTTP_404_NOT_FOUND);
    });

    var apiKeys = ['0000', '5150', '2112'];
}

/**
 * Used to define if an app.{http-verb} method supports a given MIME type,
 * useful for content negotiation.
 * @param {string} a variable number of arguments, each one represent a MIME type
 */
exports.provides = function provides() {
    var args = arguments;

    return function(req, res, next) {
        for(var i in args) {
            if(req.accepts(args[i])) return next();
        }
        next('route');
    }
}

exports.apiRoot = apiV1Root;