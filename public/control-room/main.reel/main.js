/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */

var Montage = require("montage/core/core").Montage,
    Component = require("montage/ui/component").Component,
    Confirm = require("montage/ui/popup/confirm.reel").Confirm,
    AgentBrowser = require("control-room/agent-browser").AgentBrowser;

exports.ScriptControllerDelegate = Montage.create(Montage, {
    scriptManager: {
        value: null
    },

    shouldChangeSelection: {
        value: function(target, newSelection, oldSelection) {
            var self = this;
            if (oldSelection && newSelection && self.scriptManager && self.scriptManager.scriptDetail.needsSave) {
                this.scriptManager.scriptDetail.unsavedChangesConfirm(function() {
                    self.scriptManager.scriptDetail.needsSave = false;
                    target.selectedObjects = newSelection;
                    self.scriptManager.scriptList.prepareForDraw();
                });

                return false;
            }
        }
    },

    canAddNewItem: {
        value: function(callback) {
            var self = this;

            if (this.scriptManager && this.scriptManager.scriptDetail.needsSave) {
                Confirm.show("Your script has unsaved changes. Continuing will discard any unsaved changes. Do you wish to continue?", function() {
                    // OK
                    callback();
                }, function() {
                    // Cancel, nothing need to be done here
                });

                return false;
            } else {
                callback();
            }
        }
    }
});

exports.Main = Montage.create(Component, {
    socket: {
        value: null
    },

    agents: {
        value: null
    },

    serverVersion: {
        value: ""
    },

    scripts: {
        value: null
    },

    scriptDetail: {
        value: null
    },

    scriptList: {
        value: null
    },

    emptyDetail: {
        value: null
    },

    templateDidLoad: {
        value: function() {
            this.init();
        }
    },

    init: {
        enumerable: false,
        value: function() {
            var self = this;

            // Confirm navigation away from Control Room if there's an unsaved script
            window.onbeforeunload = function() {
                var navigateAwayMessage = "Your changes to the script have not been saved yet.";
                return self.scriptDetail.needsSave ? navigateAwayMessage : null;
            }

            // Make this class visible to the scripts list delegate
            if (this.scripts.delegate) {
                this.scripts.delegate.scriptManager = this;
            }

            this.scriptDetail.addEventListener("change@scriptSource", function(event) {
                self.scriptChanged(event.plus, event.minus);
            }, false);

            this.scriptDetail.addEventListener("scriptDeleted", function(event) {
                self.scripts.remove();
                self.scripts.selectedObjects = [];
                self.scripts.selectedIndexes = [];
                self.scriptList.prepareForDraw();
                self.scriptChanged(null, null);
                self.scriptDetail.clearFields();
            }, false);

            this.socket = io.connect("http://" + document.domain + ":8081", { resource: "screening/socket.io" });

            this._initDriver();

            this.socket.on("reconnect", function() {
                self._initDriver();
            });

            this.socket.on("agentConnected", function(agentInfo) {
                var agent = AgentBrowser.create();
                agent.info = agentInfo;
                self.agents.addObjects(agent);
            });

            this.socket.on("agentDisconnected", function(agentId) {
                var displayedAgents = self.agents.organizedObjects;
                var i;
                for (i = 0; i < displayedAgents.length; ++i) {
                    if (displayedAgents[i].info.id === agentId) {
                        self.agents.removeObjects(displayedAgents[i]);
                        return;
                    }
                }
            });

            this.socket.on("testStarted", function(agentId) {
                var agent = self.getAgentById(agentId);
                agent.testing = true;
                agent.clearLog();
            });

            this.socket.on("logMessage", function(agentId, log) {
                var agent = self.getAgentById(agentId);
                agent.log(log);
            });

            this.socket.on("testProgress", function(agentId, count, total) {
                var agent = self.getAgentById(agentId);
                agent.totalSteps = total;
                agent.stepsCompleted = count;
            });

            this.socket.on("testCompleted", function(agentId, testResult) {
                var agent = self.getAgentById(agentId);
                agent.testing = false;
                self.scriptDetail.lastTestResult = testResult;
                self.scriptDetail.showResult();
            });

            // Get the available agents
            this.socket.on("getAgents", function() {
                return this.agents;
            });
        }
    },

    _initDriver: {
        value: function() {
            var self = this;
            self.agents.content = []; // TODO: find a more elegant solution to do this.
            this.socket.emit("initDriver", function(version, agentsInfo, availableTests) {
                self.serverVersion = version;
                var newAgentsArray = [];
                for (var i in agentsInfo) {
                    var agent = AgentBrowser.create();
                    agent.info = agentsInfo[i];
                    newAgentsArray.push(agent);
                }
                self.agents.content = newAgentsArray;
            });
        }
    },
    
    // TODO: Yeah, this is stupid slow but I don't care at this exact moment.
    getAgentById: {
        value: function(agentId) {
            var displayedAgents = this.agents.organizedObjects;
            for (var i = 0; i < displayedAgents.length; ++i) {
                var agent = displayedAgents[i];
                if (agent.info.id == agentId) {
                    return agent;
                }
            }
        }
    },

    scriptChanged: {
        /**
         *
         * @param {Script} newScript New Script
         * @param {Script} prevScript Previous Script
         */
        value: function(newScript, prevScript) {
            var self = this;

            // Verify if prevScript is still in the scripts array, otherwise it means it was deleted.
            if(self.scripts._content.indexOf(prevScript) === -1) {
                prevScript = null;
            }

            if (newScript && !prevScript) {
                this.emptyDetail.style.display = "none";
                //this.scriptDetail.element.style.display = "block";
            } else if (!newScript) {
                //this.scriptDetail.element.style.display = "none";
                this.emptyDetail.style.display = "table";
            }

            if (newScript) {
                localStorage["Screening.AppState.CurrentScript"] = newScript.id;
            }
        }
    }
});
