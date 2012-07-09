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
var ActionResult = require("action-result").ActionResult;

var TestRunner = exports.TestRunner = Montage.create(Montage, {
    _running: {
        enumerable: false,
        value: false
    },

    running: {
        get: function() {
            return this._running;
        },
        set: function(value) {
            this._running = value;
        }
    },

    _currentAction: {
        enumerable: false,
        value: null
    },

    currentAction: {
        get: function() {
            return this._currentAction;
        },
        set: function(value) {
            this._currentAction = value;
        }
    },

    _messages: {
        value: [],
        distinct: true
    },

    messages: {
        get: function() {
            return this._messages;
        },
        set: function(value) {
            this._messages = value;
        }
    },

    _frame: {
        enumerable: false,
        value: null
    },

    frame: {
        get: function() {
            return this._frame;
        },
        set: function(value) {
            this._frame = value;

            var self = this;
            this._frame.onload = function() {
                self.document = self.frame.contentDocument;
            }
        }
    },

    _document: {
        enumerable: false,
        value: null
    },

    document: {
        get: function() {
            return this._document;
        },
        set: function(value) {
            this._document = value;
        }
    },

    _actionStack: {
        value: [],
        distinct: true,
    },

    actionsExecuted: {
        value: -1
    },

    // Runs a list of actions and calls the given callback when they are completed
    run: {
        value: function(actions, callback) {
            this.running = true;

            if(!this.document) {
                this.document = document;
            }

            // Is this a nested call?
            if(this.currentAction) {
                var lastAction = this.currentAction;
                var oldCallback = callback;
                this.currentAction = null;
                callback = function(test) {
                    lastAction.running = false;
                    if(oldCallback) {
                        oldCallback(test);
                    }
                };
            } else {
                this.actionsExecuted = -1;
            }

            if(callback) {
                this._actionStack = actions.concat([callback], this._actionStack);
            } else {
                this._actionStack = actions.concat(this._actionStack);
            }

            this.next();
        }
    },

    // Runs the next action in the test
    next: {
        value: function() {
            this.actionsExecuted++;
            var lastAction = this.currentAction;
            if(!this._actionStack.length) {
                this.currentAction = null;
                this.running = false;
                this._dispatchCurrentActionChanged(null, lastAction);
                return;
            }
            var action = this._actionStack.shift();
            this.currentAction = action;
            this._dispatchCurrentActionChanged(action, lastAction);

            try {
                if(typeof(action) === "function") {
                    action(this);
                } else {
                    action.run(this);
                }
            } catch(ex) {
                // Any exceptions caught at this level are assumed to be error-level.
                // TODO: Is it approperitate to treat these as fatals?
                this.error("An uncaught exception was thrown", ex);
            }
        }
    },

    // Cancels the test if it is running
    cancel: {
        value: function() {
            if(this.running) {
                this._actionStack = [];
                this.running = false;
            }
        }
    },

    //=========================//
    // Logging functions //
    //=========================//

    // For all logging functions exception is optional. If passed, the system will try and extract stack trace info and

    // Info messages are not considered to be errors. Can be used to post development-centric messages back to the server
    info: {
        value: function(message, exception) {
           this._dispatchMessage(this.currentAction, "info", message, exception);
           return true;
        }
    },

    // A warning will be added to the log, but will not stop execution of the current step or the test
    warn: {
        value: function(message, exception) {
           this._dispatchMessage(this.currentAction, "warn", message, exception);
           return true;
        }
    },

    // An error will stop execution of the current step and advance to the next one, but will not stop the test
    error: {
        value: function(message, exception) {
           this._dispatchMessage(this.currentAction, "error", message, exception);
           this.next();
           return true;
        }
    },

    // A fatal error will stop the test entirely, as it is assumed that a fatal failure renders the rest of the test inoperable
    fatal: {
        value: function(message, exception) {
            this._dispatchMessage(this.currentAction, "fatal", message, exception);
            this.cancel();
            return true;
        }
    },

    _dispatchCurrentActionChanged: {
        enumerate: false,
        value: function(currentAction, lastAction) {
            var event = document.createEvent("CustomEvent");
            event.initCustomEvent("currentactionchanged", true, false);

            if(lastAction) {
                lastAction.running = false;
            }
            event.lastAction = lastAction;

            if(currentAction) {
                currentAction.running = true;
            }
            event.currentAction = currentAction;
            event.actionsExecuted = this.actionsExecuted;
            event.actionStackLength = this._actionStack.length;

            this.dispatchEvent(event);
        }
    },

    _dispatchMessage: {
        enumerate: false,
        value: function(action, level, message, exception) {
            var event = document.createEvent("CustomEvent");
            event.initCustomEvent("logmessage", true, false);
            event.action = action;
            event.level = level;
            event.message = message;
            if(exception) {
                event.exception = {
                    type: exception.type,
                    message: exception.message,
                    stack: exception.stack
                };
            }

            this.dispatchEvent(event);
        }
    }
});
