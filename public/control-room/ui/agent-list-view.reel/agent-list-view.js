/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
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
        value: null
    },

    addWebdriverButton: {
        value: null
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
