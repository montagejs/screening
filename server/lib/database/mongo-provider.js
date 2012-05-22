/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
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

    _getCollection: {
        value: function(collectionName, cb) {
            var self = this;

            self._db.collection(collectionName, function(err, resultsCollection) {
                if (err) cb(err);
                else cb(null, resultsCollection);
            });
        }
    },

    _getSelfCollection: {
        value: function(cb) {
            this._getCollection(this._collectionName, cb);
        }
    },

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

    ensureIndexes: {
        /**
         * Defines the indexes used by this MongoDB instance.
         * The indexes will only be created if they don't exist, so it's safe to run this during startup.
         */
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
    }
});