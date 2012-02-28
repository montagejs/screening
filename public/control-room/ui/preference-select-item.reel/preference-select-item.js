/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage;
var Component = require("montage/ui/component").Component;

exports.PreferenceSelectItem = Montage.create(Component, {
    preferenceObject: {
        value: null
    },

    optionsController: {
        value: null
    },

    selectInput: {
        value: null
    },

    templateDidLoad: {
        value: function() {
            this.optionsController.selectedObjects = [this.preferenceObject.value];
        }
    }
});
