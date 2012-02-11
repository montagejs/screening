/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage;
var Component = require("montage/ui/component").Component;

exports.ScriptSearch = Montage.create(Component, {
    scriptSearchBox: {
        value: null
    },

    scriptSearchCombo: {
        value: null
    },

    prepareForDraw: {
        value: function() {
            var self = this;
            self.element.addEventListener("keydown", self);

            // TODO: Open a Montage bug for this, there shouldn't be a need to set this manually.
            self.scriptSearchCombo.contentController.selectedIndexes = [0];
        }
    },

    handleKeydown: {
        value: function(event) {
            var self = this;
            // Handle ENTER key
            if (event.keyCode === 13) {
                self.searchAction(event);
            }
        }
    },

    searchAction: {
        value: function(event) {
            var self = this;

            var newEvent = document.createEvent("CustomEvent");
            newEvent.initEvent("refreshScriptList", true, false);
            newEvent.searchString = self.scriptSearchBox.value;
            newEvent.searchScope = self.scriptSearchCombo.contentController.selectedObjects[0].value;

            self.dispatchEvent(newEvent);
        }
    }
});