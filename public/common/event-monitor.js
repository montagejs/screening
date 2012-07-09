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
var ActionEventListener = require("montage/core/event/action-event-listener").ActionEventListener;
var EventManager = require("montage/core/event/event-manager").EventManager;

var Serializer = require("montage/serializer").Serializer;
var Deserializer = require("montage/core/deserializer").Deserializer;

var ScreenEvent = require("screen-event").ScreenEvent;
var ScreenDelay = require("screen-delay").ScreenDelay;
var ScreenCollection = require("screen-collection").ScreenCollection;
var TestRunner = require("test-runner").TestRunner;

var collapsibleEvents = [
    "input", "mousemove", "touchmove"
];

var EventMonitor = exports.EventMonitor = Montage.create(Montage, {
    playbackSpeed: {
        serializable: true,
        enumerable: false,
        value: 1.5
    },

    _events: {
        enumerable: false,
        value: [],
        distinct: true
    },

    events: {
        get: function() {
            return this._events;
        },
        set: function(value) {
            this._events = value;
        }
    },

    _monitoring: {
        enumerable: false,
        value: false
    },

    monitoring: {
        get: function() {
            return this._monitoring;
        },
        set: function(value) {
            this._monitoring = value;
        }
    },

    _replaying: {
        enumerable: false,
        value: false
    },

    replaying: {
        enumerable: false,
        get: function() {
            return this._replaying;
        },
        set: function(value) {
            if(this._replaying != value) {
                this._replaying = value;
            }
        }
    },

    _attachedWindow: {
        enumerable: false,
        value: null
    },

    attachedWindow: {
        get: function() {
            return this._attachedWindow;
        },
        set: function(value) {
            if(this.monitoring) {
                throw "Cannot change attached window while monitoring events";
            }
            this._attachedWindow = value;
        }
    },

    _testRunner: {
        value: null
    },

    clearEvents: {
        value: function() {
            this.events = [];
        }
    },

    toggleMonitoring: {
        value: function() {
            if(!this.monitoring) {
                this.startMonitoring();
                this._attachedWindow.focus();
            } else {
                this.stopMonitoring();
            }
        }
    },

    startMonitoring: {
        value: function() {
            if(this.replaying) {
                throw "Cannot monitor events while replaying"
            }

            if(this._attachedWindow == null) {
                this._attachedWindow = document.window;
            }
            this._attachedWindow.defaultEventManager.delegate = this;
            this.monitoring = true;
        }
    },

    stopMonitoring: {
        value: function() {
            // TODO: Detach event listener
            this._attachedWindow.defaultEventManager.delegate = null;
            this.monitoring = false;
        }
    },

    // This is where events from the attached window are processed while monitoring
    willDistributeEvent: {
        enumerable: false,
        value: function(event) {
            // Create a serializable version of the event
            var recorded = ScreenEvent.create();
            recorded.fromEvent(event);

            if(!recorded.targetIsElement) { return; }

            var lastIndex = this.events.length - 1;

            if(lastIndex >= 0) {
                var lastAction = this.events[lastIndex];
                var lastEvent;

                if(lastAction.isCollection) {
                    lastEvent = lastAction.events[lastAction.events.length - 1];
                } else {
                    lastEvent = lastAction;
                }

                // If the event is a collapsible type that follows an event of the same type collapse them into a collection
                var collapsible = collapsibleEvents.indexOf(recorded.type) != -1;
                if(collapsible && recorded.type == lastEvent.type && lastEvent.target == recorded.target) {
                    if(!lastAction.isCollection) {
                        lastAction = ScreenCollection.create();
                        //lastAction.events.push(lastEvent);
                        //this.events.splice(lastIndex, 1, lastAction);
                        this.events.push(lastAction);
                    }
                    lastAction.events.push(recorded);
                    return;
                } else {
                    if(lastEvent.timeStamp && recorded.timeStamp) {
                        var delay = recorded.timeStamp - lastEvent.timeStamp;

                        if(delay > 150) { // Let's not record any small delays
                            // TODO: is this naming confusing?
                            var testDelay = ScreenDelay.create();
                            testDelay.duration = delay;
                            this.events.push(testDelay);
                        }
                    }
                }
            }

            this.events.push(recorded);
        }
    },

    replay: {
        value: function() {
            if(this.monitoring) {
                throw "Cannot replay events while monitoring"
            }

            if(!this._testRunner) {
                this._testRunner = TestRunner.create();
            }

            this._testRunner.run(this.events, this.attachedWindow.document);
        }
    },

    stopReplay: {
        value: function() {
            if(this._testRunner) {
                this._testRunner.cancel();
            }
        }
    },

    serializeEvents: {
        value: function() {
            var serializer = Serializer.create();
            var output = serializer.serializeRootObject(this.events);
            return output.replace(/mId\=/g, "mId=screening/common/");
        }
    },

    deserializeEvents: {
        value: function(eventString) {
            var deserializer = Deserializer.create();
            deserializer.initWithString(eventString);
            var self = this;
            deserializer.deserializeRootObject(function(events) {
                self.events = events;
            });
        }
    }
});
