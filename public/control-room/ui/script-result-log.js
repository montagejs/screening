/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage;
var Component = require ("montage/ui/component").Component;

exports.ScriptResultLog = Montage.create(Component, {

    hasTemplate: {
        value: false
    },

    _result: {
        enumerable: false,
        value: null
    },

    result: {
        get: function() {
            return this._result;
        },
        set: function(result) {
            if(this._result !== result){
                this.needsDraw = true;
            }
            this._result = result;
        }
    },

    draw: {
        value: function() {
            if(this.result) {
                this.element.classList.add("result");
                this.element.classList.add(this.result.toLowerCase());
            }
            this.element.innerHTML = this.result;
            return this.result;
        }
    }

});