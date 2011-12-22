/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Db = require('mongodb').Db;
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
    }
});