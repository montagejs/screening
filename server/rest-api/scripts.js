/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var fs = require("fs"); // filesystem
var express = require('express');
var routingConfig = require("./routing-config.js");
var spawn = require('child_process').spawn;
var wrench = require('wrench');

module.exports = function(scriptsProvider) {
    var app = express.createServer();

    app.mounted(function(otherApp) {
        console.info("[scripts] express app was mounted.");
    });

    var SCRIPTS_PATH = __dirname + "/../sample_tests/";

    /**
     * GET all the scripts found in the server
     */
    app.get("/", routingConfig.provides('json', '*/*'), function(req, res, next) {
        var scriptName = req.query["name"];
        var tags = req.query["tags"];
        var nameSearch = req.query["name_search"];

        // If a name querystring property is provided then search by name
        // this should always return zero or one result
        if (scriptName) {
            console.log("GET script by name:", scriptName);

            scriptsProvider.findByName(scriptName, function(err, scripts) {
                if (err) return next(new Error(err));

                hydrateAttributes(scripts);
                res.send(scripts);
            });
        } else if (nameSearch) {
            console.log("GET script by name_search:", nameSearch);

            var scriptNameRegex = new RegExp(nameSearch, "i");
            scriptsProvider.findByName(scriptNameRegex, function(err, scripts) {
                if (err) return next(new Error(err));

                hydrateAttributes(scripts);
                res.send(scripts);
            });
        } else if (tags) {
            // If a tag or tags is provided then search using that criteria
            var tags = tags.split(",");
            console.log("GET script by tag(s):", tags);

            var tagsRegex = tags.map(function(elem) {
                return new RegExp(elem, "i");
            });
            scriptsProvider.findByTags(tagsRegex, function(err, scripts) {
                if (err) return next(new Error(err));

                hydrateAttributes(scripts);
                res.send(scripts);
            });
        } else {
            console.log("GET All scripts");

            var excludeCode = req.query["exclude_code"] ? req.query["exclude_code"] : false;

            scriptsProvider.findAll(function(err, scripts) {
                if (err) return next(new Error(err));

                hydrateAttributes(scripts);
                res.send(scripts);
            });
        }
    });

    /**
     * GETs an archive (ZIP) of all the scripts found in the server
     *
     */
    app.get("/archive", function(req, res, next) {
        // Create a temp directory
        var prefix = SCRIPTS_PATH.substr(0, SCRIPTS_PATH.length - 1);
        var destDir = prefix + "_archive_" + Math.floor(Math.random() * 10000);

        fs.mkdirSync(destDir, 0755);

        scriptsProvider.findAll(function(err, scripts) {
            if (err) return next(new Error(err));

            // Dump all the currently displayed scripts into temp
            scripts.forEach(function(script) {
                var newFileName = destDir + "/" + script.name;
                var fd = fs.openSync(newFileName, 'w', 0755);
                fs.writeSync(fd, script.code);
                fs.closeSync(fd);
            });

            // Create a zip from destDir
            // Options -r recursive -j ignore directory info - redirect to stdout
            var zip = spawn('zip', ['-rj', '-', destDir]);

            res.contentType('zip');

            // Keep writing stdout to res
            zip.stdout.on('data', function (data) {
                res.write(data);
            });

            zip.stderr.on('data', function (data) {
                // Uncomment to see the files being added
                // console.log('zip stderr: ' + data);
            });

            // End the response on zip exit
            zip.on('exit', function (code) {
                if (code !== 0) {
                    res.statusCode = 500;
                    console.log('zip process exited with code ' + code);
                    return next(new Error('Error creating ZIP file, zip command exited with code: ' + code));
                } else {
                    wrench.rmdirSyncRecursive(destDir);
                    res.end();
                }
            });
        });
    });

    /**
     * GET a script by its id
     */
    app.get("/:id", routingConfig.provides('json', '*/*'), function(req, res, next) {
        console.log("GET Scripts/:id " + req.params.id);

        scriptsProvider.findById(req.params.id, function(err, script) {
            if (err) return next(new Error(err));

            hydrateAttributes(script);
            res.send(script);
        });
    });

    /**
     * Download the specified script, it will simply spit out the contents of the file as plain text.
     * Also sets the downloadable headers to the browser
     *
     */
    app.get("/:id/download", routingConfig.provides('*/*'), function(req, res, next) {
        var id = req.params.id;
        console.log("GET Scripts/:id " + id + " - Download");

        scriptsProvider.findById(req.params.id, function(err, script) {
            if (err) return next(new Error(err));

            res.header('Content-Type', 'text/plain');
            res.header('Pragma', 'private');
            res.header('Cache-Control', 'private, must-revalidate');
            var savedName = script.name.match(/\.js/) ? script.name : script.name + ".js";
            res.header('Content-Disposition', 'attachment; filename=' + savedName);
            res.send(script.code);
        });
    });

    /**
     * Creates a new script, it requires a JSON object in the Request Body in the following format:
     * {"name": "My Script Name", "code": "The script contents"}
     */
    app.post("/", routingConfig.provides('json', '*/*'), function(req, res, next) {
        var body = req.body;

        if (!body) {
            res.statusCode = 400;
            return next(new Error("The request must contain a body!"));
        }

        var now = new Date();
        var generatedName = "Unnamed Script - " + now.toISOString();

        if (!body.name) {
            body.name = generatedName;
            body.code = "";
        }
        body.modified = now;

        scriptsProvider.upsert(body, function(err, object) {
            if (err) return next(new Error(err));

            hydrateAttributes(object);
            res.send(object);
        });
    });

    // Update a script
    app.put("/:id", routingConfig.provides('json', '*/*'), function(req, res, next) {
        var id = req.params.id;
        console.log("PUT with scriptId:", id);

        var body = req.body;
        if (!body) {
            res.statusCode = 400;
            return next(new Error("Request contained no body"))
        }

        var newName = body.name;
        if (!newName) {
            res.statusCode = 400;
            return next(new Error("New name not specified"));
        }

        var code = body.code;
        if (!code) {
            console.log('code was blank'); // Should be a warning TODOz
        }

        // Add id to body
        body._id = id;
        body.modified = new Date();

        scriptsProvider.upsert(body, function(err, object) {
            if (err) {
                return next(new Error(JSON.stringify(err)));
            }

            hydrateAttributes(object);
            res.send(object);
        });
    });

    // Delete a Script
    app.delete("/:id", routingConfig.provides('json', '*/*'), function(req, res, next) {
        var id = req.params.id;

        scriptsProvider.delete(id, function(err) {
            if (err) return next(new Error(err));
            res.send({deleted: true});
        });
    });

    // Helper Functions:

    /**
     *
     */
    function hydrateAttributes(scripts) {
        if (Array.isArray(scripts)) {
            scripts.forEach(function(elem) {
                elem.size = elem.code.length;
            });
        } else {
            scripts.size = scripts.code.length;
        }
    }

    function scriptSources(exclude_code) {
        var files = fs.readdirSync(SCRIPTS_PATH);

        var scriptSources = [];
        for (var i in files) {
            var filename = files[i]
            if (filename.indexOf(".") == 0) {
                continue;
            } // Skip hidden files

            var stat = fs.statSync(SCRIPTS_PATH + filename);

            if (stat.isDirectory()) {
                continue;
            }

            var newScriptSource = {
                name: files[i],
                size: stat.size,
                modified: stat.mtime
            };

            if (!exclude_code) {
                var contents = fs.readFileSync(SCRIPTS_PATH + files[i], 'utf8');
                newScriptSource.code = contents
            }
            scriptSources.push(newScriptSource);
        }

        return scriptSources;
    }

    function scriptSource(script_name) {
        var filename = SCRIPTS_PATH + script_name;
        var file = fs.readFileSync(filename, 'utf8');
        var stat = fs.statSync(filename);

        return {
            name: script_name,
            size: stat.size,
            modified: stat.mtime,
            code: file
        };
    }

    return app;
}