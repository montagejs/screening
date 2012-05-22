/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
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
    },

    upsert: {
        /**
         * Updates a script if it exists, otherwise it inserts a new one
         * @param script
         * @param cb
         */
        value: function(script, cb) {
            var self = this;

            self._getSelfCollection(function(err, scriptsCollection) {
                if (err) cb(err);
                else {
                    if (script._id) {
                        var objectId = new BSON.ObjectID(script._id.toString());
                    } else {
                        var objectId = new BSON.ObjectID();
                    }

                    // Important: Remove _id from script before updating with $set
                    delete script._id;

                    scriptsCollection.findAndModify(
                        {"_id": objectId},
                        [
                            ['_id','asc']
                        ],
                        {$set: script},
                        {upsert:true, "new": true},
                        function(err, object) {
                            cb(err, object);
                        }
                    );
                }
            });
        }
    },

    delete: {
        /**
         * Deletes a script by it's id
         *
         * @param scriptId the id of the script to delete
         * @param cb
         */
        value: function(scriptId, cb) {
            var self = this;

            self._getSelfCollection(function(err, scriptsCollection) {
                if (err) cb(err);
                else {
                    scriptsCollection.remove({"_id": new BSON.ObjectID(scriptId.toString())}, function(err, script) {
                        if (err) cb(err);
                        else {
                            cb(null, script);
                        }
                    });
                }
            });
        }
    }
});

module.exports = ScriptsProvider;