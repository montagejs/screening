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

var asserts = require('./assert.js');
var getStackTrace = require("../util.js").getStackTrace;

exports.init = function(result, scriptObject){

    /**
     * We use this counter to determine which asserts have already been reported (to the result object).
     * We don't want to report assert results multiple times, since we are executing the tests
     * multiple times.
     */
    var assertRuns = 0;

    var reportingStopped = false;

    /**
     * This is the
     *
     */
    var assertsDecorator = {};
    /**
     * We just override all assert functions and wrap the result-object around it
     *
     */
    for (var func in asserts){
        (function(func, result){
            assertsDecorator[func] = function(){
                // If the assert to be executed had already been reported don't execute and report it again.
                if (assertRuns == result.asserts.length && !reportingStopped){
                    var res = asserts[func].apply(asserts, arguments);
                    var stackTrace = getStackTrace(__filename, 1);
                    var assertResult = {
                        assertType: func,
                        success: res,
                        time: new Date() - result.startTime,
                        lineNumber: stackTrace[0].lineNumber,
                        columnNumber: stackTrace[0].columnNumber,
                        fileName: stackTrace[0].fileName,
                        stackTrace: stackTrace
                    };
                    if (asserts.hasNoExpectedValue.indexOf(func)!=-1){
                        assertResult.expectedValue = "<" + func.replace(/^assert/, "").toLowerCase() + ">";
                        assertResult.actualValue = arguments[0];
                        assertResult.message = arguments[1];
                    } else {
                        assertResult.expectedValue = arguments[0];
                        assertResult.actualValue = arguments[1];
                        assertResult.message = arguments[2];
                    }
                    result.reportAssert(assertResult);
                    if (!res && scriptObject.getOption("exitOnFailure")){
                        reportingStopped = true;
                    }
                }
                assertRuns++;
            }
        })(func, result);
    }
    return assertsDecorator;
};

exports.initSync = function(result, scriptObject, sync){
    var assertsDecorator = {};
    var reportingStopped = false;
    /**
     * Override all assert functions and wrap the result-object around it
     */
    for (var func in asserts){
        (function(func, result){
            assertsDecorator[func] = function(){
                var assertArguments = arguments;
                var stackTrace = getStackTrace(__filename, 1);
                sync.once(function() {
                    var res = asserts[func].apply(asserts, assertArguments);
                    var assertResult = {
                        assertType: func,
                        success: res,
                        time: new Date() - result.startTime,
                        lineNumber: stackTrace[0].lineNumber,
                        columnNumber: stackTrace[0].columnNumber,
                        fileName: stackTrace[0].fileName,
                        stackTrace: stackTrace
                    };
                    if (asserts.hasNoExpectedValue.indexOf(func)!=-1){
                        assertResult.expectedValue = "<" + func.replace(/^assert/, "").toLowerCase() + ">";
                        assertResult.actualValue = assertArguments[0];
                        assertResult.message = assertArguments[1];
                    } else {
                        assertResult.expectedValue = assertArguments[0];
                        assertResult.actualValue = assertArguments[1];
                        assertResult.message = assertArguments[2];
                    }
                    if(!reportingStopped) {
                        result.reportAssert(assertResult);
                        if (!res && scriptObject.getOption("exitOnFailure")){
                            reportingStopped = true; // TODO: How to terminate nicely?
                        }
                    }
                    return res;
                });
            }
        })(func, result);
    }
    return assertsDecorator;
};
