/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var BSON = require('mongodb').BSONPure,
    MongoDbProvider = require("../database/mongo-provider.js");

var ScriptsBatchesProvider = function(db) {
    this._db = db;
}

ScriptsBatchesProvider.prototype = Object.create(MongoDbProvider.prototype, {
    constructor: {
        value: ScriptsBatchesProvider,
        enumerable: false
    },

    _collectionName: { value: "scriptsBatches" }
});

module.exports = ScriptsBatchesProvider;
