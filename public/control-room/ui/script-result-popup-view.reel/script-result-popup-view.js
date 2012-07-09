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
var Component = require("montage/ui/component").Component;

exports.ScriptResultPopupView = Montage.create(Component, {
    status: {
        value: "UNKNOWN"
    },

    resultUrl: {
        value: ""
    },

    prepareForDraw: {
        value: function() {
            var self = this;

            // Get the testcaseId from the queryString
            self.testcaseId = window.location.search.substring(1);
            if (!self.testcaseId) {
                alert("Please pass the id of the testcase in the URL.");
                return;
            }

            // Get the test status
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("load", function(evt) {
                var data = JSON.parse(evt.target.responseText);
                self.status = data.status;
            }, false);

            var url = "/screening/api/v1/test_results/" + self.testcaseId + "?api_key=5150";
            xhr.open("GET", url);
            xhr.send();

            self.resultUrl = "script-result.html?" + self.testcaseId;
        }
    }
});
