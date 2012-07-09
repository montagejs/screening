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
const apiV1Root = '/api/v1';
const HTTP_200_OK = 200;
const HTTP_401_UNAUTHORIZED = 401;
const HTTP_404_NOT_FOUND = 404;
const HTTP_500_INTERNAL_SERVER_ERROR = 500;

exports.apiKeyAuth = function(app) {
    var apiKeys = ['0000', '5150', '2112'];

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
}

exports.init = function(app) {

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
