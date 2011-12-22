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

    webdriverUrlPrompt: {
        value: null
    },

    addWebdriverButton: {
        value: null
    },
    
    _agentUrlText: {
        enumerable: false,
        value: ""
    },
    
    agentUrlText: {
        get: function() {
            return this._agentUrlText;
        },
        set: function(value) {
            this._agentUrlText = value;
        }
    },
    
    prepareForDraw: {
        value: function() {
            var self = this;
            this.agentUrlText = "Go to: <server_root>/screening/agent/index.html";
            this.webdriverUrlPrompt.addEventListener("message.ok", self._addWebDriverAgentCallback);
        }
    },

    addWebDriverAgent: {
        value: function() {
            var popup = Popup.create();
            popup.content = this.webdriverUrlPrompt; // the content inside the Popup
            popup.modal = true;
            popup.show();
        }
    },

    _addWebDriverAgentCallback: {
        value: function(event) {
            var self = this;
            var req = new XMLHttpRequest();
            req.open("POST", "/screening/api/v1/agents/webdriver?api_key=5150", true);
            req.setRequestHeader("Content-Type", "application/json");
            req.onreadystatechange = function(aEvt) {
                if(req.readyState == 4 && req.status >= 300) {
                    var resp = JSON.parse(req.response);
                    Alert.show(resp.error);
                }
            };
            req.send(JSON.stringify({
                url: self.value
            }));
        }
    }
});