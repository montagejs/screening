/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage;
var Component = require ("montage/ui/component").Component;
var ScriptSource = require("control-room/script-source").ScriptSource;

exports.AgentView = Montage.create(Component, {
    _agent: {
        value: null
    },
    
    agent: {
        get: function() {
            return this._agent;
        },
        set: function(value) {
            this._agent = value;
            this.needsDraw = true;
        }
    },
    
    agentIcon: {
        enumerable: false,
        value: null
    },

    agentHostString: {
        value: ""
    },

    prepareForDraw: {
        value: function() {
            var self = this;
            var clickListener = function(){
                var xhr = new XMLHttpRequest();
                var removeAgentUrl = "/screening/api/v1/agents/" + encodeURIComponent(self.agent.info.id) + "?api_key=5150";
                xhr.open("DELETE", removeAgentUrl);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send();
                self.needsDraw = false;
                self.agentDelete.removeEventListener("click", clickListener, false);
            };
            this.agentDelete.addEventListener("click", clickListener, false);

            // Set up the host string
            var address = this.agent.info.address;
            if(address.match(/^http:/)) {
                this.agentHostString = address.substring(7); // Cut out "http://"
            } else {
                this.agentHostString = address;
            }
        }
    },
    
    draw: {
        value: function() {
            // Clear out existing embeddedAgent icons
            // TODO: someday we could actually make this a switch component and we
            //      wouldn't need this entire method.
            var childElements = this.agentIcon.querySelectorAll('.embeddedAgent');
            if(childElements.length > 0) {
                for(var i = 0; i < childElements.length; ++i) {
                    this.agentIcon.removeChild(childElements[i]);
                }
            }

            if(this.agent.info.capabilities && this.agent.info.capabilities.browserName) {
                var browserName = this.agent.info.capabilities.browserName;
                browserName = browserName.replace(/\s/g, ""); // Remove spaces. "internet explorer" => "internetexplorer"
                this.agentIcon.classList.add(browserName);
            }
        }
    },
});