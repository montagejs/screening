var express = require('express');
var app = express.createServer();
var screening = require('../server.js');
var socketApi = require("../lib/sockets.js");
var path = require("path");

module.exports = Object.create(Object.prototype, {
    PORT: { value: 9999 },

    BASE_URL: {
        get: function() {
            var self = this;
            return 'http://127.0.0.1:' + self.PORT + '/screening/api/v1'
        }
    },

    startServer: {
        value: function(port) {
            port = port || this.PORT;

            screening.configureServer();

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
    }
});
