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

var fs = require("fs"),
    path = require("path"),
    vm = require("vm"),
    agentTypes = require('./agent-pool.js').agentTypes,

    Sync = require('./sync.js').Sync,
    ScriptClass = require('./testcase/script.js').Script,
    Result = require('./testcase/result.js').Result,

    // Promises
    Q = require("q"),
    when = Q.when,

    // Webdriver Agent
    WebDriverAgent = require('./agents-webdriver/agent.js').WebDriverAgent,
    createWebdriverSession = require('./agents-webdriver/util.js').createWebdriverSession,
    mouseEnum = require('./agents-webdriver/util.js').Mouse,
    keyEnum = require('./agents-webdriver/util.js').Key,

    // Actually we just import the assert.js, to generate the mapping code further down, that we inject in the test script,
    // no idea how to otherwise map methods to the inside-function scope, so we generate them.
    assertDecorator = require('../lib/testcase/assert-decorator.js'),
    asserts = require('./testcase/assert.js'),
    getStackTraceByErrorStack = require("./util.js").getStackTraceByErrorStack,
    TMP_TEST_FILE_NAME = require("../consts.js").TMP_TEST_FILE_NAME;

/**
 * Test TestcaseRunner is able to execute tests. With it we can trigger
 * which tests should be executed where.
 *
 * @constructor
 * @param {Object} agentPool a management pool of agents where we can select from
 * @param {Boolean} isDebugMode defines if we run in debug-mode
 */
var TestcaseRunner = exports.TestcaseRunner = function(agentPool, isDebugMode, testcaseResultsProvider) {
    this.browsers = [];
    this.agentPool = agentPool;
    this.isDebugMode = !!isDebugMode;
    this.resultsProv = testcaseResultsProvider;
};

/**
 * Executes a test file that is accessible by this node instance.
 *
 * @param {String} testFile full path to a file on disk
 * @param {Object} desiredCaps which capabilities should the agent support
 * @return void
 */
TestcaseRunner.prototype.executeTestFile = function(testFile, desiredCaps) {
    var self = this;

    fs.readFile(testFile, "utf8", function(err, data) {
        self.executeTest(data, desiredCaps);
    });
}

/**
 * Executes a script string.
 *
 * @param {String} testScript a complete test script object, contains the code and name
 * @param {Object} desiredCaps which capabilities should the agent support
 * @param {Object} options will describe preferences during this run of the code (they do not persist)
 * @return void
 */
TestcaseRunner.prototype.executeTest = function(testScript, desiredCaps, options) {
    // TODO: extract the agents from the testscript
    var agent = this.agentPool.getAgentByCaps(desiredCaps);
    agent.startTest();

    var result;

    // If we are a webdriver agent, use the new backend
    if(agent.type == agentTypes.WEBDRIVER) {
        result = this._executeWebdriverTest(testScript, agent, options);
    }

    // add the result to our central repository
    this.resultsProv.upsert(result.get(), function(err, object) {
        if (err) throw err;
    });
    return result.testcase.id;
};

TestcaseRunner.prototype._executeWebdriverTest = function(testScript, agent, options) {
    var self = this;
    var session = createWebdriverSession(agent.url);
    var sync = Object.create(Sync).init();

    // Validate that the passed testScript object contains code and name
    if(!testScript.code || !testScript.name) throw new Error("testScript must be an object with code and name properties.");

    // Create the result object
    var result = new Result(agent, {
        id: this.resultsProv.generateId(),
        code: testScript.code,
        name: testScript.name
    });

    // the options object can be manipulated in the test script
    var scriptObject = new ScriptClass();
    scriptObject.sync = sync;
    for(var i in testScript.preferences) {
        var pref = testScript.preferences[i];
        scriptObject.setOption(pref.shortName, pref.value);
    }
    for(var i in options){
        scriptObject.setOption(i, options[i]);
    }

    var agentConstructor = function() { return new WebDriverAgent(session, sync, scriptObject, result); };

    var writeResultsAndShowNotification = function() {
        // Write the results to the DB
        result.finalize();

        self.resultsProv.upsert(result.get(), function(err, object) {
            if (err) throw err;
        });

        // Show the notification to the control room
        agent.endTest(result.get());
    }

    // Start the webdriver session
    session.init(agent.capabilities, function(err) {
        if(!err.sessionId) {
            // Wrap error message inside Error object if required
            if (!(err instanceof Error)) {
                if (err.value && err.value.message) {
                    err = new Error(err.value.message);
                } else {
                    err = new Error(err);
                }
            }

            // If we have a valid session quit, if not simply display the results
            if (session.sessionUrl) {
                session.quit().then(function successCb() {
                    result.reportException(err);
                    writeResultsAndShowNotification();
                });
            } else {
                result.reportException(err);
                writeResultsAndShowNotification();
            }
        } else {
            // Execute the test, using our code synchronization system
            when(self._executeTestInVm(testScript.code, result, agentConstructor, scriptObject, sync), function() {
                // kill the webdriver session
                session.quit().then(function() {
                    writeResultsAndShowNotification();
                });
            });
        }
    });

    return result;
};

/**
 * Execute the given testcase source code on a given agent.
 */
TestcaseRunner.prototype._executeTestInVm = function(source, result, agent, scriptObject, sync){
    var self = this;
    // We have to execute test-scripts from the filesystem to get line-numbers.
    var decoratedAsserts = assertDecorator.initSync(result, scriptObject, sync);

    var defer = Q.defer();

    try {
        var script = vm.createScript(source, TMP_TEST_FILE_NAME);
        var scriptContext = {
            __result: result,
            script: scriptObject,
            Agent: agent,
            Mouse: mouseEnum,
            Key: keyEnum,
            console: console
        };

        scriptObject.globalObjects = {Agent: agent, script: scriptObject};
        // Add all asserts to the script context that we are passing into the test scripts env.
        for (var f in decoratedAsserts) {
            if (f.substr(0, 6)=="assert") { // We ONLY want the assert functions.
                scriptObject.globalObjects[f] = scriptContext[f] = decoratedAsserts[f];
            }
        }
    } catch(ex) {
        ex.message = "Error parsing script: " + ex.message;
        ex.lineNumber = "Unknown";
        ex.columnNumber = "Unknown";
        result.reportException(ex);
        defer.resolve();
        return defer.promise;
    }

    sync.runSync(function() {
        script.runInNewContext(scriptContext);
    }).then(function() {
        defer.resolve();
    }, function(ex) {
        var lineCol = getStackTraceByErrorStack(ex.stack, TMP_TEST_FILE_NAME);
        ex.lineNumber = lineCol[0]-1;
        ex.columnNumber = lineCol[1];
        result.reportException(ex);
        defer.resolve();
    });

    return defer.promise;
};
