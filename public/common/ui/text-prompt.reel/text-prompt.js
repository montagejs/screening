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

var TextPrompt = exports.TextPrompt = Montage.create(Component, {
    hasTemplate: {value: true},

    headerEl: {
        value: null,
        serializable: true
    },
    titleEl: {
        value: null,
        serializable: true
    },

    title: {
        value: 'Information'
    },

    msg: {
        value: '',
        serializable: true
    },

    promptInput: {
        value: null
    },

    value: {
        value: null,
        serializable: true
    },

    draw: {
        value: function() {
        }
    },

    _popup: {
        value: null
    },
    popup: {
        set: function(value) {
            this._popup = value;
        },
        get: function() {
            return this._popup;
        }
    },

    prepareForDraw: {
        value: function() {
            this.element.addEventListener("keyup", this, false);
        }
    },

    handleKeyup: {
        value: function(evt) {
            if(evt.keyCode == 13 /*Enter*/) {
                this.handleOkAction(evt);
            } else if (evt.keyCode == 27 /*Escape*/) {
                this.handleCloseAction(evt);
            }
        }
    },

    handleOkAction: {
        value: function(event) {
            var anEvent = document.createEvent("CustomEvent");
            anEvent.initCustomEvent("message.ok", true, true, "Prompt result was OK");

            this.dispatchEvent(anEvent);
            this._popup.hide();
        }
    },

    handleCloseAction: {
        value: function(event) {
            var anEvent = document.createEvent("CustomEvent");
            anEvent.initCustomEvent("message.close", true, true, "Prompt result was Cancel");

            this.dispatchEvent(anEvent);
            this._popup.hide();
        }
    }

});
