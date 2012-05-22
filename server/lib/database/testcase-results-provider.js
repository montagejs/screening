/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var BSON = require('mongodb').BSONPure,
    MongoDbProvider = require("../database/mongo-provider.js");

module.exports = TestcaseResultsProvider;

function TestcaseResultsProvider(db) {
    this._db = db;
}

TestcaseResultsProvider.prototype = Object.create(MongoDbProvider.prototype, {
    constructor: {
        value: TestcaseResultsProvider,
        enumerable: false
    },

    _collectionName: { value: "testcaseResults" },

    _db: {
        value: null,
        enumerable: false
    },

    findByDateRange: {
        /**
         * Finds all the results between the specified dates.
         * One or both dates can be specified depending on the desired range.
         * @param startTimeAfter non inclusive
         * @param startTimeBefore non inclusive
         * @param cb
         */
        value: function(startTimeAfter, startTimeBefore, options, cb) {
            if("function" === typeof options) {
                cb = options;
                options = {};
            }
            var self = this;
            var optionsAndKeywords = self.extractReservedKeywords(options);
            options = optionsAndKeywords.options;
            var keywords = optionsAndKeywords.keywords;

            self._getSelfCollection(function(err, resultsCollection) {
                if (err) cb(err)
                else {
                    // Construct query dateRange
                    var dateRange = {};
                    if (startTimeAfter) {
                        dateRange["$gt"] = startTimeAfter;
                    }
                    if (startTimeBefore) {
                        dateRange["$lt"] = startTimeBefore;
                    }

                    resultsCollection.find({startTime: dateRange}, options, function(err, cursor) {
                        if (err) cb(err);
                        else {
                            cursor.skip(keywords.skip || 0);
                            cursor.limit(keywords.limit || 0);
                            cursor.sort(keywords.sort);
                            cursor.toArray(function(err, results) {
                                if (err) cb(err);
                                else cb(null, results);
                            });
                        }
                    });
                }
            });
        }
    },

    findByRestrictions: {
        value: function(restrictions, options, cb) {
            if("function" === typeof options) {
                cb = options;
                options = {};
            }
            var self = this;
            var optionsAndKeywords = self.extractReservedKeywords(options);
            options = optionsAndKeywords.options;
            var keywords = optionsAndKeywords.keywords;

            self._getSelfCollection(function(err, resultsCollection) {
                if (err) cb(err);
                else {
                    resultsCollection.find(restrictions, options, function(err, cursor) {
                        if (err) cb(err);
                        else {
                            cursor.skip(keywords.skip || 0);
                            cursor.limit(keywords.limit || 0);
                            cursor.sort(keywords.sort);
                            cursor.toArray(function(err, results) {
                                if (err) cb(err);
                                else cb(null, results);
                            });
                        }
                    });
                }
            });
        }
    },

    /**
     * Update if exists, if not then insert
     */
    upsert: {
        value: function(result, cb) {
            var self = this;

            self._getSelfCollection(function(err, resultsCollection) {
                if (err) cb(err);
                else {
                    if (!result._id) {
                        throw new Error("An _id property must be provided!");
                    }
                    var objectId = new BSON.ObjectID(result._id.toString());

                    // Important: Remove _id from result before updating with $set
                    delete result._id;

                    resultsCollection.findAndModify(
                        {"_id": objectId},
                        [
                            ['_id','asc']
                        ],
                        {$set: result},
                        {upsert:true, "new": true},
                        function(err, object) {
                            cb(err, object);
                        }
                    );
                }
            });
        }
    },

    deleteMultipleById: {
        value: function(ids, cb) {
            var self = this;

            // Surround the ids inside {"_id": <a real objectId>}
            var idObjects = ids.map(function(elem) {
                return {"_id": new BSON.ObjectID(elem.toString())};
            });

            self._getSelfCollection(function(err, resultsCollection) {
                if (err) cb(err);
                else {
                    resultsCollection.remove(
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

    metadata: {
        /**
         * Gets the metadata for testcase-results.
         * Metadata includes:
         * - Total results
         * @param {Function} cb
         */
        value: function(restrictions, cb) {
            var self = this;
            var metadata = {};

            if ("function" === typeof restrictions) {
                cb = restrictions;
                restrictions = {};
            }

            self._getSelfCollection(function(err, resultsCollection) {
                if (err) cb(err);
                else {
                    resultsCollection.find(restrictions, {}, function(err, cursor) {
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
