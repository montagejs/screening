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
var Montage = require("montage/core/core").Montage,
    Component = require ("montage/ui/component").Component,
    Popup = require ("montage/ui/popup/popup.reel").Popup,
    Alert = require ("montage/ui/popup/alert.reel").Alert,
    ScriptSource = require("control-room/script-source").ScriptSource;

exports.AgentListView = Montage.create(Component, {
    agentController: {
        value: null
    },

    webdriverDialog: {
        value: null,
        serializable: true
    },

    addWebdriverButton: {
        value: null,
        serializable: true
    },

    templateDidLoad: {
        value: function() {
            var self = this;
            self.webdriverDialog.addEventListener("message.ok", self._webdriverDialogCallback);
        }
    },

    prepareForDraw: {
        value: function() {
            var self = this;
            // Auto-select the first agent if available
            if (!self.agentController.selectedIndexes && self.agentController.content.length > 0) {
                self.agentController.selectedIndexes = [0];
            }
        }
    },

    addWebDriverAgent: {
        value: function() {
            var popup = Popup.create();
            popup.content = this.webdriverDialog; // the content inside the Popup
            popup.modal = true;
            popup.show();
        }
    },

    _webdriverDialogCallback: {
        value: function(event) {
            var req = new XMLHttpRequest();
            req.open("POST", "/screening/api/v1/agents/webdriver?api_key=5150", true);
            req.setRequestHeader("Content-Type", "application/json");
            req.onreadystatechange = function(aEvt) {
                if(req.readyState == 4 && req.status >= 300) {
                    var resp = JSON.parse(req.response);
                    Alert.show(resp.error);
                }
            };
            req.send(JSON.stringify(event.detail));
        }
    }
});
