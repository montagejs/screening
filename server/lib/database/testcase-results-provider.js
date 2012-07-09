/* <copyright>
Copyright (c) 2012, Motorola Mobility, Inc
All Rights Reserved.
BSD License.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

  - Redistributions of source code must retain the above copyright notice,
    this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.
  - Neither the name of Motorola Mobility nor the names of its contributors
    may be used to endorse or promote products derived from this software
    without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
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
    }
});
