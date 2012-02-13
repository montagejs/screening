/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage;
var Component = require("montage/ui/component").Component;
var ScriptSource = require("control-room/script-source").ScriptSource;

exports.ScriptListView = Montage.create(Component, {
    scriptController: {
        value: null
    },

    scriptDetail: {
        value: null
    },

    scriptUploader: {
        value: null
    },

    prepareForDraw: {
        value: function() {
            var self = this;
            self.queryScriptSources();
            self.scriptUploader.addEventListener('uploadEvent', this, false);
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
                self.prepareForDraw();
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