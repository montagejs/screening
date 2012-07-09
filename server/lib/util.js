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

var TMP_TEST_FILE_NAME = require("../consts.js").TMP_TEST_FILE_NAME;

/**
 * Return the line and column number of the current position.
 * Therefore we generate an error object and parse the stacktrace of it.
 * To exactly determine which is the line+column of the code we want
 * to know about we need the filename paramter, and the offset tells
 * how many files before/after the given file is the one we are looking for.
 * @param {String} fileName The file name where we want to know the line+col for.
 * @param {String} fileOffset If we only know the file name we are currently in
 *                  but not that one of our 'parent' file we pass -1 here.
 * @returns {Array} [lineNumber, columnNumber]
 */
exports.getStackTrace = function(fileName, fileOffset){
    return getStackTraceByErrorStack(new Error().stack, fileName, fileOffset);
};

/**
 * See getLineAndColumn() docs.
 * This function is actually the same, only that it takes the stacktrace as the first parameter.
 * @param {String} stack Normally the value of exception.stack.
 */
var getStackTraceByErrorStack = exports.getStackTraceByErrorStack = function(stack, fileName, fileOffset){
    var stackLines = stack.split("\n").slice(1); // first line == "Error" and we don't need that
    var foundAt = false;
    var lineCol = [];
    var _fileName = fileName ? fileName : __filename;
    var wasFound = stackLines.some(function(line, index){ // Use some() so it stops as soon as we return true, and foundAt contains the lineNo we stopped at.
        foundAt = index;
        return line.indexOf(_fileName) != -1; // It's true when we have found the right file name.
    });
    fileOffset = typeof fileOffset=="undefined" ? (fileName ? 0 : 1) : fileOffset;
    foundAt = foundAt + fileOffset;
    var neededStackLines = stackLines.slice(foundAt);
    var stackTrace = [];
    for (var i=0, l=neededStackLines.length, line; i<l; i++){
        line = neededStackLines[i];
        var lineInfo = {};
        var infoMatch = line.match(/.*\s([^\s]+):([\d]+):([\d]+)/);
        if (infoMatch){
            lineInfo.lineNumber = parseInt(infoMatch[2], 10);
            lineInfo.columnNumber = parseInt(infoMatch[3], 10);
            lineInfo.fileName = infoMatch[1].replace(/^\(/, ""); // Sometimes we have a leading "(" remove this here.
        }
        stackTrace.push(lineInfo);
        // If we found the last file we want end it here.
        if (line.indexOf(TMP_TEST_FILE_NAME) != -1){
            break;
        }
    }
    return stackTrace;

    // TODO: this is never called??? Remove???
    // Replace all characters other than letters and numbers by a "." to not break the dynamically created regexp.
    var lineNoMatch = stackLines[foundAt].match(/:([\d]+):([\d]+)/);
    if (wasFound && lineNoMatch && lineNoMatch.length && lineNoMatch.length>=fileOffset){
        lineCol = [parseInt(lineNoMatch[1], 10), parseInt(lineNoMatch[2], 10)];
    }
    return lineCol;
};


var lastMemUsage = 0;
exports.logMemoryUsage = function(s){
    var mem = process.memoryUsage().heapUsed;
    var diff = mem - lastMemUsage;
    console.log("Memory used since last log:", s || "", diff);
    lastMemUsage = mem;
};
