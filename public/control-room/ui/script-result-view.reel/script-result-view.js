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
var Montage = require("montage/core/core").Montage;
var Component = require ("montage/ui/component").Component;

exports.ScriptResultView = Montage.create(Component, {
    testcaseName: {
        value: null
    },

    testcaseId: {
        value: null
    },

    completeResult: {
        value: null
    },

    downloadJsonUrl: {
        value: null
    },

    viewJsonUrl: {
        value: null
    },

    status: {
        value: null
    },

    agent: {
        value: null
    },

    totalSuccessfulAsserts: {
        value: null
    },

    totalFailedAsserts: {
        value: null
    },

    totalExceptions: {
        value: null
    },

    messages: {
        value: []
    },

    warningsStyle: {
        value: false
    },

    warnings: {
        value: []
    },

    prepareForDraw: {
        value: function() {
            var self = this;
            // we pass the test-id within the search-string of the url
            this.testcaseId = window.location.search.substring(1);
            if(! this.testcaseId) {
                alert("Please pass the id of the testcase in the URL.");
                return;
            }
            var xhr = new XMLHttpRequest();
            var data, assert;
            xhr.addEventListener("load", function(evt) {
                data = JSON.parse(evt.target.responseText);
                self.completeResult = JSON.stringify(data, null, 4);
                self.testcaseName = data.testcase.name;
                self.status = data.status;
                self.agent = data.agent;

                // Display Warnings if present
                if (data.warnings && Array.isArray(data.warnings) && data.warnings.length > 0) {
                    self.warnings = data.warnings;
                    self.warningsStyle = true;
                }

                self.messages.push({
                    result: "START",
                    type: "Start test run",
                    time: 0,
                    detail: "Starting test run at " + data.startTime,
                    lineNumber: 0,
                    columnNumber: 0
                });
                for(var i=0, l=data.asserts.length; i<l; i++) {
                    assert = data.asserts[i];
                    self.messages.push({
                        result: assert.success ? "PASS" : "FAIL",
                        type: assert.assertType,
                        time: assert.time,
                        lineNumber: assert.lineNumber,
                        columnNumber: assert.columnNumber,
                        fileName: assert.fileName,
                        detail: "Actual value: " + JSON.stringify(assert.actualValue) + "\n" +
                            "Expected value: " + JSON.stringify(assert.expectedValue) + "\n" +
                            "Message: " + assert.message
                    });
                }
                if(data.exception){
                    var exceptionDetails = data.exception.message;

                    // Hide the Selenium Server extra information in the results page, it'll still be available
                    // in the JSON download
                    var SELENIUM_EXTRA = "(WARNING: The server did not provide any stacktrace information)";
                    var seleniumExtraStart = exceptionDetails.search(SELENIUM_EXTRA);
                    if (seleniumExtraStart > -1) {
                        exceptionDetails = exceptionDetails.substring(0, seleniumExtraStart - 1);
                    }

                    if (data.exception.arguments && Array.isArray(data.exception.arguments)) {
                        var exceptionArgs = data.exception.arguments.map(function(elem) {
                            return (elem.chainable && elem.chainable._selector) ? elem.chainable._selector : elem;
                        });
                        exceptionDetails += "\nARGUMENTS: " + exceptionArgs;
                    }
                    self.messages.push({
                        result: "EXCEPTION",
                        type: "Exception",
                        detail: exceptionDetails,
                        time: data.exception.time,
                        lineNumber: data.exception.lineNumber,
                        columnNumber: data.exception.columnNumber
                    });
                }
                var code = data.testcase.code.split("\n");
                self.messages.push({
                    result: "END",
                    type: "End test",
                    time: new Date(data.endTime) - new Date(data.startTime),
                    detail: "End test run at " + data.endTime,
                    lineNumber: code.length,
                    columnNumber: code[code.length-1].length
                });

                // Update total successful asserts
                self.totalSuccessfulAsserts = data.asserts.reduce(function(prevValue, value) {
                    return prevValue + (value.success ? 1 : 0);
                }, 0);

                // Update total failed asserts
                self.totalFailedAsserts = data.asserts.reduce(function(prevValue, value) {
                    return prevValue + (!value.success ? 1 : 0);
                }, 0);
                self.totalExceptions = data.exception ? 1 : 0;
            }, false);
            var link = this.viewJsonUrl = "/screening/api/v1/test_results/" + self.testcaseId + "?api_key=5150";
            this.downloadJsonUrl = link + "&download=true";
            xhr.open("GET", this.downloadJsonUrl);
            xhr.send();
        }
    }
});
