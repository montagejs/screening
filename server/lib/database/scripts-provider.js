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
var BSON = require('mongodb').BSONPure,
    MongoDbProvider = require("../database/mongo-provider.js");

var ScriptsProvider = function(db) {
    this._db = db;
}

ScriptsProvider.prototype = Object.create(MongoDbProvider.prototype, {
    constructor: {
        value: ScriptsProvider,
        enumerable: false
    },

    _collectionName: { value: "scripts" },

    _db: {
        value: null,
        enumerable: false
    },

    findByName: {
        /**
         * Finds all the scripts that match the given name expression.
         *
         * @param scriptName
         * @param cb
         */
        value: function(scriptName, cb) {
            var self = this;

            self._getSelfCollection(function(err, scriptsCollection) {
                if (err) cb(err);
                else {
                    scriptsCollection.find({name: scriptName}, function(err, cursor) {
                        if (err) cb(err);
                        else {
                            cursor.sort({name: 1});
                            cursor.toArray(function(err, scripts) {
                                if (err) cb(err);
                                else cb(null, scripts);
                            });
                        }
                    });
                }
            });
        }
    },

    findByTags: {
        /**
         * Finds all the scripts tagged with the given tags, the scripts must have all the tags given (tag1 && tag2 && tagN)
         *
         * @param tags
         * @param cb
         */
        value: function(tags, cb) {
            var self = this;

            self._getSelfCollection(function(err, scriptsCollection) {
                if (err) cb(err);
                else {
                    scriptsCollection.find({tags: {"$all": tags}}, function(err, cursor) {
                        if (err) cb(err);
                        else {
                            cursor.sort({name: 1});
                            cursor.toArray(function(err, scripts) {
                                if (err) cb(err);
                                else cb(null, scripts);
                            });
                        }
                    });
                }
            });
        }
    }
});

module.exports = ScriptsProvider;
