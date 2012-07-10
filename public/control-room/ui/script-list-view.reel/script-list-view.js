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
var Component = require("montage/ui/component").Component;
var ScriptSource = require("control-room/script-source").ScriptSource;
var Keyboard = require("common/keyboard").Keyboard;

exports.ScriptListView = Montage.create(Component, {
    scriptController: {
        value: null
    },

    scriptDetail: {
        value: null
    },

    scriptUploader: {
        value: null,
        serializable: true
    },

    scriptList: {
        value: null,
        serializable: true
    },

    prepareForDraw: {
        value: function() {
            var self = this;
            self.queryScriptSources();
            self.scriptUploader.addEventListener('uploadEvent', this, false);

            self.element.addEventListener("keyup", function(evt) {
                if(evt.keyCode === Keyboard.keyNames["ENTER"]) { // Enter Key Code
                    self.scriptController.selectedObjects = [document.activeElement.controller.scriptSource]
                }
            });

            self.element.addEventListener("keydown", function(evt){
                if(evt.keyCode === Keyboard.keyNames["UP"]) {
                    document.activeElement.parentElement.previousElementSibling.firstElementChild.focus();
                }

                if(evt.keyCode === Keyboard.keyNames["DOWN"]) {
                    document.activeElement.parentElement.nextElementSibling.firstElementChild.focus();
                }
            });
        }
    },

    handleRefreshScriptList: {
        value: function(event) {
            var self = this;
            self.queryScriptSources(null, event.searchScope, event.searchString);
        }
    },

    handleUploadEvent: {
        value: function(event) {
            this.queryScriptSources(event.script.name);
        }
    },

    queryScriptSources: {
        value: function(scriptName, searchScope, searchString) {
            var self = this;
            //console.log(searchScope);
            var url = "/screening/api/v1/scripts?api_key=5150";

            if (searchString && searchString.trim()) {
                if (searchScope && searchScope === "tags") {
                    // Parse tags: tag "multi word" -> tag, multi word
                    var tags = searchString.match(/\w+|"[^"]+"/g);
                    if (tags) {
                        tags.forEach(function(elem, index) {
                            tags[index] = tags[index].replace(/"/g, "");
                        });
                    }
                    tags = tags.join(",");
                    url += "&tags=" + encodeURIComponent(tags);
                } else if (searchScope && searchScope === "name") {
                    url += "&name_search=" + encodeURIComponent(searchString);
                }
            }

            var req = new XMLHttpRequest();
            req.open("GET", url, true);
            req.onload = function(event) {
                var lastScriptId = localStorage["Screening.AppState.CurrentScript"];
                self.scriptController.content = [];
                var sources = JSON.parse(this.responseText);
                var selectedScript = null;
                var selectedScriptIndex = null;
                var scriptSources = [];
                for (var i in sources) {
                    var scriptSource = ScriptSource.create();
                    scriptSource.fromServer(sources[i]);
                    scriptSources.push(scriptSource);

                    // We want to select a script if one was passed in or
                    // if we have stored one in localStorage. Passed in name
                    // gets the preference between the two. Hopefully this logic
                    // does that.
                    if (scriptName && scriptName === scriptSource.name) {
                        selectedScript = scriptSource;
                        selectedScriptIndex = i;
                    }

                    if(!selectedScript && !scriptName && lastScriptId == scriptSource.id) {
                        selectedScript = scriptSource;
                        selectedScriptIndex = i;
                    }
                }
                self.scriptController.content = scriptSources;

                if (selectedScript && selectedScriptIndex) {
                    self.scriptController.selectedObjects = selectedScript;
                    self.scriptController.selectedIndexes = [selectedScriptIndex];
                }
            };

            // If the script editor contents have changed then prompt the user
            if (self.scriptDetail && self.scriptDetail.needsSave) {
                self.scriptDetail.unsavedChangesConfirm(function() {
                    req.send(null);
                });
            } else {
                req.send(null);
            }
        }
    },

    _createNewScript: {
        value: function() {
            var self = this;

            var req = new XMLHttpRequest();
            req.open("POST", "/screening/api/v1/scripts/?api_key=5150", true);
            req.onload = function(event) {
                var createdScript = JSON.parse(this.responseText);

                // Create a proper ScriptSource object and then populate it with the response
                var scriptSource = ScriptSource.create();
                scriptSource.fromServer(createdScript);

                self.scriptController.addObjects(scriptSource);
                self.needsDraw = true;
            };
            req.send(null);
        }
    },

    // Button Methods
    createNewScript: {
        value: function() {
            if (this.delegate && this.delegate.canAddNewItem) {
                this.delegate.canAddNewItem(this._createNewScript.bind(this));
            } else {
                this._createNewScript();
            }
        }
    },

    downloadAllScripts: {
        value: function() {
            window.location.href = "/screening/api/v1/scripts/archive?api_key=5150";
        }
    }
});
