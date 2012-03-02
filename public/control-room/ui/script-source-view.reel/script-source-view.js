/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage;
var Component = require ("montage/ui/component").Component;
var MutableEvent = require("montage/core/event/mutable-event").MutableEvent;

exports.ScriptSourceView = Montage.create(Component, {
    _scriptSource: {
        enumerable: false,
        value: null
    },
    
    scriptSource: {
        get: function() {
            return this._scriptSource;
        },
        set: function(value) {
            this._scriptSource = value;
        }
    }
});