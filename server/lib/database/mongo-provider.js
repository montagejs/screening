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
var Db = require('mongodb').Db;
var BSON = require('mongodb').BSONPure
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

module.exports = MongoDbProvider;

function MongoDbProvider(host, port) {
    this._db = new Db("screening", new Server(host, port, {auto_reconnect: true}, {}));
    this._db.open(function(err, dbConn) {
        if (err) {
            console.error("Couldn't connect to MongoDB, plese check /docs/MongoDb.md for info on how to setup the MongoDB server", err.message);
            process.exit(1);
        } else {
            console.log("Connected to MongoDB server on " + dbConn.serverConfig.host + ":" + dbConn.serverConfig.port + ", database: " + dbConn.databaseName);
        }
    });

    return this;
}

MongoDbProvider.prototype = Object.create(Object, {
    constructor: {
        value: MongoDbProvider,
        enumerable: false
    },

    _db: {
        value: null,
        enumerable:false
    },

    db: {
        get: function() {
            return this._db;
        }
    },

    /**
     * Generates an ObjectId
     * @function
     */
    generateId: {
        value: function() {
            return new BSON.ObjectID();
        }
    },

    /**
     * Gets a reference to the specified collection
     * @function
     * @param collectionName {String}
     * @parama cb {Function} callback
     */
    _getCollection: {
        value: function(collectionName, cb) {
            var self = this;

            self._db.collection(collectionName, function(err, resultsCollection) {
                if (err) cb(err);
                else cb(null, resultsCollection);
            });
        }
    },

    /**
     * Gets a reference to the collectionName specified in this provider.
     * @function
     * @param cb {Function} callback
     */
    _getSelfCollection: {
        value: function(cb) {
            this._getCollection(this._collectionName, cb);
        }
    },

    /**
     * Updates an object if it exists, otherwise it inserts a new one
     * @param object {Object} the object to insert into the collection
     * @param cb {Function} callback
     */
    upsert: {
        value: function(object, cb) {
            var self = this;

            self._getSelfCollection(function(err, objectsCollection) {
                if (err) cb(err);
                else {
                    if (object._id) {
                        var objectId = new BSON.ObjectID(object._id.toString());
                    } else {
                        var objectId = new BSON.ObjectID();
                    }

                    // Important: Remove _id from object before updating with $set
                    delete object._id;

                    objectsCollection.findAndModify(
                        {"_id": objectId},
                        [
                            ['_id', 'asc']
                        ],
                        {$set: object},
                        {upsert: true, "new": true},
                        function(err, object) {
                            cb(err, object);
                        }
                    );
                }
            });
        }
    },

    /**
     * Deletes an object by it's id
     *
     * @function
     * @param objectId the id of the script to delete
     * @param cb {Function} callback
     */
    delete: {
        value: function(objectId, cb) {
            var self = this;

            self._getSelfCollection(function(err, objectsCollection) {
                if (err) cb(err);
                else {
                    objectsCollection.remove({"_id": new BSON.ObjectID(objectId.toString())}, function(err, script) {
                        if (err) cb(err);
                        else {
                            cb(null, script);
                        }
                    });
                }
            });
        }
    },

    /**
     * Deletes all the elements in a collection
     *
     * @function
     * @param collectionName
     * @param callback {Function}
     */
    deleteAll: {
        value: function(collectionName, cb) {
            var self = this;

            self._getCollection(collectionName, function(err, collection) {
                if (err) cb(err);
                else {
                    collection.remove({}, function(err, deleted) {
                        if (err) cb(err);
                        else {
                            cb(null, deleted);
                        }
                    });
                }
            });
        }
    },

    /**
     * Deletes multiple objects by their id
     * @function
     * @param ids {Array} array of ids to delete
     * @param cb {Function} callback
     */
    deleteMultipleById: {
        value: function(ids, cb) {
            var self = this;

            // Surround the ids inside {"_id": <a real objectId>}
            var idObjects = ids.map(function(elem) {
                return {"_id": new BSON.ObjectID(elem.toString())};
            });

            self._getSelfCollection(function(err, objectsCollection) {
                if (err) cb(err);
                else {
                    objectsCollection.remove(
                        {$or: idObjects},
                        {},
                        function(err, object) {
                            cb(err, object);
                        }
                    );
                }
            });
        }
    },

    /**
     * Returns all the objects in the collection
     * @function
     * @param options {Object} optional sort, limit and skip parameters for the query
     * @param cb {Function} callback
     */
    findAll: {
        value: function(options, cb) {
            if("function" === typeof options) {
                cb = options;
                options = {};
            }
            var self = this;
            var optionsAndKeywords = self.extractReservedKeywords(options);
            options = optionsAndKeywords.options;
            var keywords = optionsAndKeywords.keywords;

            self._getSelfCollection(function(err, objectsCollection) {
                if (err) cb(err)
                else {
                    objectsCollection.find({}, options, function(err, cursor) {
                        if (err) cb(err)
                        else {
                            cursor.skip(keywords.skip || 0);
                            cursor.limit(keywords.limit || 0);
                            cursor.sort(keywords.sort);
                            cursor.toArray(function(err, objects) {
                                if (err) cb(err)
                                else cb(null, objects);
                            });
                        }
                    });
                }

            });
        }
    },

    /**
     * Finds a object by Id
     *
     * @function
     * @param scriptId
     * @param cb
     */
    findById: {
        value: function(objectId, cb) {
            var self = this;

            self._getSelfCollection(function(err, objectCollection) {
                if (err) cb(err);
                else {
                    objectCollection.findOne({"_id": new BSON.ObjectID(objectId.toString())}, cb);
                }
            });
        }
    },

    /**
     * Defines the indexes used by this MongoDB instance.
     * The indexes will only be created if they don't exist, so it's safe to run this during startup.
     * @function
     */
    ensureIndexes: {
        value: function() {
            var self = this;

            self._getCollection("scripts", function(err, scriptsCollection) {
                if (err) cb(err);
                else {
                    scriptsCollection.ensureIndex({name: 1}, {unique: true}, function(err, indexName) {
                        if (err) {
                            console.error("Couldn't create index", err.message);
                            process.exit(1);
                        } else {
                            return;
                        }
                    })
                }
            });
        }
    },

    /**
     * Extracts special option reserved keywords from the options object.
     * Used for reserved keywords like limit and skip.
     * @function
     * @param {Object} options
     * @return {Object} an object with two properties:
     *     options - the original options with the reserved keywords removed
     *     keywords - the keywords found in options
     */
    extractReservedKeywords: {
        value: function(options) {
            var reservedKeywordsList = ["limit", "skip", "sort"];
            var retOptions = {};
            var retKeywords = {};
            var option;

            for (option in options) {
                if (options.hasOwnProperty(option)) {
                    if (reservedKeywordsList.indexOf(option) != -1) {
                        retKeywords[option] = options[option];
                    } else {
                        retOptions[option] = options[option];
                    }
                }
            }

            return {options: retOptions, keywords: retKeywords};
        }
    },

    /**
     * Gets the metadata for this collection.
     * Metadata includes:
     * - Total objects in collection
     * @function
     * @param cb {Function} callback
     */
    metadata: {
        value: function(restrictions, cb) {
            var self = this;
            var metadata = {};

            if ("function" === typeof restrictions) {
                cb = restrictions;
                restrictions = {};
            }

            self._getSelfCollection(function(err, objectsCollection) {
                if (err) cb(err);
                else {
                    objectsCollection.find(restrictions, {}, function(err, cursor) {
                        if (err) cb(err);
                        else {
                            cursor.count(function(err, count) {
                                metadata.count = count;
                                cb(err, metadata);
                            });
                        }
                    });
                }
            });
        }
    }
});
