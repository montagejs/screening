/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage;
var Component = require("montage/ui/component").Component;

var TextPrompt = exports.TextPrompt = Montage.create(Component, {
    hasTemplate: {value: true},
    
    headerEl: {
        value: null
    },
    titleEl: {
        value: null
    },
    
    title: {
        value: 'Information'
    },
    
    msg: {
        value: ''
    },
    
    promptInput: {
        value: null
    },
    
    value: {
        value: null
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