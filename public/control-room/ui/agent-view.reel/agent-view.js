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
        serializable: true,
        enumerable: false,
        value: null
    },

    agentDelete: {
        serializable: true,
        enumerable: false,
        value: null
    },

    // Used for the title full text
    agentHostElement: {
        serializable: true,
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

            this.agentHostElement.title = this.agentHostString;
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
