/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var TMP_TEST_FILE_NAME = require("../../consts.js").TMP_TEST_FILE_NAME;
var path = require("path");
var getStackTraceByErrorStack = require("../util.js").getStackTraceByErrorStack;

var Result = exports.Result = function(agent, testcase) {
    this.startTime = new Date();
    this.name = "Undefined";
    this.endTime = null;
    this.testcase = testcase;
    // TODO: we will have more agents in the future
    this.agent = agent;
    this.exception = null;
    this.asserts = [];
    this.warnings = [];
    this._lastAssertResult = null;
}

Result.prototype._cleanFileName = function(fileName) {
    var cleanedFileName = "";

    if (fileName == TMP_TEST_FILE_NAME) {
        cleanedFileName = this.testcase.name;
    } else {
        cleanedFileName = fileName.replace(path.normalize(path.join(__dirname, "../../sample_tests/")), "");
    }
    return cleanedFileName;
}

Result.prototype.reportException = function(exception) {
    // Currently we just support one failure!
    // Copy all from exception into this.exception, and add props later.
    this.exception = deepCopy(exception, 4);

    // The following are implemented via getters, and don't copy using for-in, it seems.
    if(exception.stack) {
        var stackTrace = getStackTraceByErrorStack(exception.stack, TMP_TEST_FILE_NAME);
        this.exception.stack = exception.stack;
        this.exception.stackTrace = stackTrace;
        this.exception.lineNumber = exception.lineNumber || stackTrace[0].lineNumber;
        this.exception.columnNumber = exception.columnNumber || stackTrace[0].columnNumber;
        this.exception.fileName = this._cleanFileName(exception.fileName || stackTrace[0].fileName);
    } else {
        this.stack = "";
        this.stackTrace = "";
        this.fileName = TMP_TEST_FILE_NAME;
    }

    // TODO: add the right id
    this.exception.agent = this.agent.friendlyName;
    this.exception.time = new Date() - this.startTime;
    this.exception.level = "error";

    // Also inform the main server and the control-room about it.
    this.agent.processLog(this.exception);
}

Result.prototype.reportAssert = function(assert) {
    this._lastAssertResult = assert.success;
    assert.fileName = this._cleanFileName(assert.fileName);
    this.asserts.push(assert);
}

Result.prototype.reportWarning = function(warning) {
    // TODOz: any other manipulations on this?
    this.warnings.push(warning);
}

Result.prototype.didLastAssertFail = function() {
    return this._lastAssertResult === false; // Only really false is a fail, null and stuff are not explicit enough!
};

Result.prototype.finalize = function() {
    this.endTime = new Date();
}

var isDate = function(object) {
    return Object.prototype.toString.call(object) === '[object Date]';
};

// Utility function to copy an object, but only allow it to iterate so many levels deep
function deepCopy(src, maxDepth, filterKeys) {
    var type = typeof src,
        key, value, dest;

    if(!src || type !== "object" || isDate(src)) { return src; }

    dest = Array.isArray(src) ? [] : {};
    if(maxDepth <= 0) { return dest; }

    for(key in src) {
        try {
            if(typeof src[key] == "function") { continue; } // Ignore functions
            dest[key] = deepCopy(src[key], maxDepth-1);
        } catch(ex) {} // If something fails, silently ignore that key and move on
    }
    return dest;
}

Result.prototype.get = function() {
    // This is a little bit more generalized than old method
    // and prevents unexpected infinite recursion
    var ret = deepCopy(this, 4, ["agent", "testcase"]);

    // Add the properties from testcase except 'id'
    ret.testcase = {};
    for (var key in this.testcase) {
        if (this.testcase.hasOwnProperty(key) && key != 'id') {
            ret.testcase[key] = this.testcase[key];
        }
    }
    
    // TODO: add more details of the agent
    // atm it is not serializable because of the socket.io object
    ret._id = this.testcase.id;
    ret.agent = this.agent.friendlyName;

    // Add an overall status for the test, possible values:
    // RUNNING, PASSED, FAILED, EXCEPTION
    var status = "PASSED";
    if (ret.endTime) {
        if (ret.exception) {
            status = "EXCEPTION";
        } else {
            if (ret.asserts.some(function(value) {
                return value.success === false;
            })) {
                status = "FAILED";
            }
        }
    } else {
        status = "RUNNING";
    }

    ret.status = status;

    return ret;
}

