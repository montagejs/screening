/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
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
