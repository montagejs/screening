/* <copyright>
Copyright (c) 2012, Motorola Mobility LLC.
All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of Motorola Mobility LLC nor the names of its
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
</copyright> */

var getStackTrace = require("../util.js").getStackTrace;

var Warning = exports.Warning = {};

/**
 * deprecateApi - function to display a warning as well as call the passed in function.
 *      The message will be displayed in the results view to notify the user.
 *
 * @param {Function} functionToCall
 * @param {String} deprecatedFunctionName
 * @param {String} msg An optional message that will be appended to the warning.
 */
Warning.deprecateApi = function(functionToCall, deprecatedFunctionName, msg){
    var name = functionToCall.name;
    msg = msg ? msg : "";

    return function() {
        // This should be a WebDriverElment
        var stackTrace = getStackTrace(__filename, 1);
        var warning = {
            type: "deprecatedApi",
            message: "The function: " + deprecatedFunctionName + " has been deprecated. " + msg,
            lineNumber: stackTrace[0].lineNumber,
            columnNumber: stackTrace[0].columnNumber,
            fileName: stackTrace[0].fileName
        };

        var self = this;
        this.sync.once(function() {
            self.result.reportWarning(warning)
        });

        return functionToCall.apply(this, arguments);
    };
};
