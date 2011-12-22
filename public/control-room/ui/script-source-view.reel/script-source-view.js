/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage;
var Component = require ("montage/ui/component").Component;

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
    },

    /*downloadScriptSource: {
        value: function() {
            var self = this;
            window.location.href = "/screening/api/v1/scripts/" + self.scriptSource.name + "/download?api_key=5150";
        }
    }*/
});