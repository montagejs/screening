/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
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

            var url = "/screening/api/v1/test_results/" + self.testcaseId;
            xhr.open("GET", url);
            xhr.send();

            self.resultUrl = "script-result.html?" + self.testcaseId;
        }
    }
});