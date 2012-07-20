var express = require('express');
var app = express.createServer();
var screening = require('../server.js');
var socketApi = require("../lib/sockets.js");
var path = require("path");
var MongoDbProvider = require("../lib/database/mongo-provider.js");
var ScriptsProvider = require("../lib/database/scripts-provider.js");

module.exports = Object.create(Object.prototype, {
    PORT: { value: 9999 },

    BASE_URL: {
        get: function() {
            var self = this;
            return 'http://127.0.0.1:' + self.PORT + '/screening/api/v1'
        }
    },

    customMongoDbProvider: {
        value: new MongoDbProvider("localhost", 27018)
    },

    clearDatabase: {
        value: function(callback) {
            var provider = this.customMongoDbProvider;

            provider.deleteAll("scripts", function() {
                provider.deleteAll("batches", function() {
                    provider.deleteAll("testecase-results", callback);
                })
            });
        }
    },

    /**
     * Takes an array of Script objects and inserts them sequentially in the database.
     * Calls the callback when done and returns the ids of the created script documents.
     */
    insertScripts: {
        value: function(scripts, callback) {
            var self = this;
            var ids = [];
            var scriptsProvider = new ScriptsProvider(self.customMongoDbProvider.db);

            scriptsProvider.upsert(scripts.shift(), function lambda(err, object) {
                if (err) callback(err);

                if(object) {
                    ids.push(object._id);

                    if(scripts.length > 0) {
                        scriptsProvider.upsert(scripts.shift(), lambda);
                    } else {
                        callback(null, ids);
                    }
                }
            });
        }
    },

    startServer: {
        value: function(port) {
            port = port || this.PORT;

            screening.configureServer(this.customMongoDbProvider);

            app.configure(function() {
                app.use("/screening", screening.app);

                // Socket.io Initialization
                socketApi.init(app, screening.agentPool, screening.SCREENING_VERSION);
            });

            app.configure('development', function() {
                var MONTAGE_PATH = path.join(__dirname, "../../public/node_modules/montage");

                app.use("/node_modules/montage", express.static(MONTAGE_PATH));
                app.use("/node_modules/montage", express.directory(MONTAGE_PATH));
            });

            app.listen(port);
            console.log("Environment: Node.js -", process.version, "Platform -", process.platform);
            console.log("Screening Server running on port " + port);
        }
    },

    stopServer: {
        value: function() {
            app.close();
        }
    }
});
