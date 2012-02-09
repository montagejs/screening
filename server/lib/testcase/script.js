/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
/**
	@module screening/script
*/
var path = require("path");
var fs = require("fs");
var wrench = require("wrench");
var MongoDbProvider = require("../database/mongo-provider.js");
var ScriptsProvider = require("../database/scripts-provider.js");
var settings = require("../../settings.js");
var Q = require("q"),
    when = Q.when;
/**
    @class module:screening/script.Script
*/

var Script = exports.Script = function(mongoDbProvider) {
    this.mongoDbProvider = mongoDbProvider || new MongoDbProvider(settings.mongoDB.host, settings.mongoDB.port);

    this.scriptsProvider = new ScriptsProvider(this.mongoDbProvider);

    // NOTE: the options are no objects yet (though) that looks like a no-brainer to make them
    // an object. But it would just be overhead for now, since access (for now) is only done
    // explicitly onto a option using the full string, for getting and setting.
    // Maybe later, but would be just overhead now.

   /**
   @enum module:screening/script.Script
   */
    this._options = {
        /**
         * Tell the test script to quit on the first assert's failure.
         * If set to false, failing asserts will be reported but not lead to
         * stopping the test script.
         * There is also a way to set this value in the UI explicitly for test,
         * setting the option inside the script will override that UI option.
         * @type {Boolean}
         * @default false
         */
        "exitOnFailure": false,

        /**
         * This timeout applies in the following places:
         * If an agent.element() call fails to find the element searched for on the first try, it will be retried.
         * If the element can be found within the given time it will return it. If
         * the element can still not be found the test script will abort with an error "No such element".
         * This timeout does also apply as the default timeout for all waitFor*() functions,
         * if no explicit timeout is given to them as one of it's parameters.
         * @type {Integer}
         * @default 3000ms
         */
        "timeout": 3000,

        /**
         * This timeout is applied when a page is loaded. After loading a page
         * the execution will wait for that time. (currently applied to the webdriver agent)
         * @type {Integer}
         * @default 1000ms
         */
        "loadTimeout": 1000,

        /**
         * There are multiple sync modes implemented:
         * * auto - This chooses the appropriate (most common) default way of syncing.
         *   For iframe agents this is "body.innerHTML", for webdriver agents it's "webdriver.default"
         * * webdriver.default - Webdriver brings it's own (simple) way of syncing requests and
         *   returning when a request is done, that is natively implemented.
         *   For now this one is used implicitly when running against a webdriver agent.
         * * body.innerHTML - The default way to syncronize the sequential test command is a simple
         *   check on the body.innerHTML.length value, while it changes the site seems to be changing
         *   and we assume the previous command is not "done" yet, so we wait until no changes take
         *   place anymore to fire the next command. If you have a site that changes constantly, no matter
         *   the interaction with it this mode might not be what you want, but most "normal" apps
         *   work using this method.
         * * none - which means the test script execution does not take any additional care about
         *   syncing the script execution, which mostly means the test script author takes care of it
         *   by herself using for example agent.wait() calls
         * * montage.draw - NOT IMPLEMENTED YET
         *   This mode listens only on the montage's draw cycle and when there is nothing in the queue
         *   it assumes the last test script command is done and fires the next one.
         *   NOTE: Of course this ONLY works with montage apps.
         * @type {String}
         * @default "auto"
         */
        "sync.mode":"auto",

        /**
         * If no change took place on the page during this timeout
         * we assume the page is "done" loading.
         * Internally we check if the page has changed in shorter intervals to reset the
         * the internal offset from where to wait.
         * If you set this to a higher value the test playback might becomes slower, simply
         * because it will always wait for that (long) time to verify that no
         * change has taken place. So make sure to not abuse this value.
         * In combination with agent.wait() you might achieve more efficient goals.
         *
         * For sequential mousemoves and touchmoves this value is not taken into account,
         * they come with their own recorded timeouts each, those are used, since otherwise
         * each mousemove would require those max timeout to be waited.
         * @type {Integer}
         * @default 150ms
         */
        "sync.noChangeTimeout": 150,

        /**
         * If the site changes constantly we don't want each command to wait eternally, so set this
         * timeout to when the command shall be considered done the latest, in order to not
         * block the script.
         * @type {Integer}
         * @default 2000ms
         */
        "sync.maxWaitTimeout": 2000,

        /**
         * The waitFor functions wait for a given time until they report that a certian result was
         * not met. If this timeout is very high, it is convinient to tell to try multiple times
         * while waiting, therefore you can set this value here.
         * For example, if you set it to 100 (which is 100ms) a request will be sent at least
         * every 100ms to see if the waitFor condition has already been met.
         * @type {Integer}
         * @default 500ms
         */
        "waitFor.minRetryTimeout": 500
    };

    this.globalObjects = {};

    // Required for asynchronous functions
    this.sync = null;
};

/**
 * Sets the value of the specified option. For an option list see [set options]{@link module:screening/script}.
 * @function module:screening/script.Script#setOption
 * @param {String} key Option name to set.
 * @param {String} value Value to set option to.
 * @returns {Script} A reference to this, to allow chaining.
 */
Script.prototype.setOption = function(key, value){
    this._options[key] = value
};

/**
 * Gets the value of the specified option
 * @function module:screening/script.Script#getOption
 * @param {String} key Option name to query.
 * @returns {Object} Option value.
 */
Script.prototype.getOption = function(key){
    return this._options[key];
};

/**
 * Returns an object containing all of the currently active options for the script
 * @function module:screening/script.Script#getOptions
 * @returns {Object} Active options
 */
Script.prototype.getOptions = function(){
    return this._options;
};

/**
 * Import the contents of another script into the currently executing one
 * @function module:screening/script.Script#require
 * @param {String} filename Name of script to import.
 * @returns {Object} Exports object from imported script.
 */
Script.prototype.require = function(filename) {
    var self = this;
    var defer = Q.defer();

    return self.sync.promise(function() {
        self.scriptsProvider.findByName(filename, function(err, scripts) {
            if (err) throw new Error(err);

            if (scripts.length === 0) {
                defer.reject("The required script '" + filename + "' does not exist.");
                return;
            } else if (scripts.length !== 1) {
                defer.reject("Unexpected error, found more than one script that matches the name: " + filename);
                return;
            }

            var script = scripts[0];

            // Create temp directory
            var testScriptsDir = path.normalize(__dirname + "/../../sample_tests");
            var destDir = testScriptsDir + "_temp_" + Math.floor(Math.random() * 10000);
            fs.mkdirSync(destDir, 0755);

            var requireName = destDir + "/" + script.name;
            var fd = fs.openSync(requireName, 'w', 0755);
            fs.writeSync(fd, script.code);
            fs.closeSync(fd);

            // Try to require the script and report any errors.
            try {
                var exportsObject = require(requireName);
            } catch(ex) {
                wrench.rmdirSyncRecursive(destDir);
                defer.reject("The required script '" + filename + "' has an error: " + ex.message);

                return defer.promise;
            }

            delete require.cache[requireName]; // Remove the required script from the cache, so changes apply without the need to restart the server.
            var wrappedExportsObject = {};
            for (var i in exportsObject) {
                // Wrap all the functions and add all the context's variables as first parameter, add all other params behind.
                if (typeof exportsObject[i] == "function") {
                    wrappedExportsObject[i] = (function(i) {
                        return function() {
                            return exportsObject[i].apply(exportsObject, [self.globalObjects].concat([].slice.call(arguments)));
                        }
                    })(i);
                }
            }

            wrench.rmdirSyncRecursive(destDir);

            defer.resolve(wrappedExportsObject);
        });
        return defer.promise;
    });
};

/**
 * Make the execution wait for the given number of milliseconds.
 * @function module:screening/script.Script#wait
 * @param {Integer} ms The given number of milliseconds to wait.
 */
Script.prototype.wait = function(ms){
    var self = this;
    return this.sync.promise(function() {
        var defer = Q.defer();
        setTimeout(function() {
            defer.resolve(self); // Return self to allow chaining
        }, ms ? ms : 0);
        return defer.promise;
    });
};
