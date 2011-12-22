/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var BSON = require('mongodb').BSONPure;

module.exports = TestcaseResultsProvider;

function TestcaseResultsProvider(mongoDbProvider) {
    this._db = mongoDbProvider.db;
}

TestcaseResultsProvider.prototype = Object.create(Object, {
    constructor: {
        value: TestcaseResultsProvider,
        enumerable: false
    },

    _db: {
        value: null,
        enumerable: false
    },

    _getCollection: {
        value: function(cb) {
            var self = this;

            self._db.collection("testcaseResults", function(err, resultsCollection) {
                if (err) cb(err);
                else cb(null, resultsCollection);
            });
        }
    },

    generateId: {
        value: function() {
            return new BSON.ObjectID();
        }
    },

    /**
     * Returns all the available Testcase Results
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

            self._getCollection(function(err, resultsCollection) {
                if (err) cb(err)
                else {
                    resultsCollection.find({}, options, function(err, cursor) {
                        if (err) cb(err)
                        else {
                            cursor.skip(keywords.skip || 0);
                            cursor.limit(keywords.limit || 0);
                            cursor.sort({startTime: -1});
                            cursor.toArray(function(err, results) {
                                if (err) cb(err)
                                else cb(null, results);
                            });
                        }
                    });
                }

            });
        }
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

            self._getCollection(function(err, resultsCollection) {
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
                            cursor.sort({startTime: -1});
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

            self._getCollection(function(err, resultsCollection) {
                if (err) cb(err);
                else {
                    resultsCollection.find(restrictions, options, function(err, cursor) {
                        if (err) cb(err);
                        else {
                            cursor.skip(keywords.skip || 0);
                            cursor.limit(keywords.limit || 0);
                            cursor.sort({startTime: -1});
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

    findById: {
        value: function(testcaseId, cb) {
            var self = this;

            self._getCollection(function(err, resultsCollection) {
                if (err) cb(err);
                else {
                    resultsCollection.findOne({"_id": new BSON.ObjectID(testcaseId.toString())}, cb);
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

            self._getCollection(function(err, resultsCollection) {
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

            self._getCollection(function(err, resultsCollection) {
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

            self._getCollection(function(err, resultsCollection) {
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
    },

    extractReservedKeywords: {
        /**
         * Extracts special option reserved keywords from the options object.
         * Used for reserved keywords like limit and skip.
         * @param {Object} options
         * @return {Object} an object with two properties:
         *     options - the original options with the reserved keywords removed
         *     keywords - the keywords found in options
         */
        value: function(options) {
            var reservedKeywordsList = ["limit", "skip"];
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
