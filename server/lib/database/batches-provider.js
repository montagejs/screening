/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var BSON = require('mongodb').BSONPure,
    MongoDbProvider = require("../database/mongo-provider.js");

var BatchesProvider = function(db) {
    this._db = db;
}

BatchesProvider.prototype = Object.create(MongoDbProvider.prototype, {
    constructor: {
        value: BatchesProvider,
        enumerable: false
    },

    _collectionName: { value: "batches" }
});

module.exports = BatchesProvider;
