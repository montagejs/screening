/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage;
var Component = require("montage/ui/component").Component;

exports.ScriptResultsSearch = Montage.create(Component, {
    _searchOptionsVisible: {
        enumerable: false,
        value: false
    },

    _resultsSearchBox: {
        enumerable: false,
        value: null
    },

    resultsSearchBox: {
        enumerable: true,
        get: function() {
            return this._resultsSearchBox;
        },
        set: function(value) {
            this._resultsSearchBox = value;
        }
    },

    searchOptionsVisible: {
        enumerable: true,
        get: function() {
            return this._searchOptionsVisible;
        },
        set: function(value) {
            this._searchOptionsVisible = value;
        }
    },

    prepareForDraw: {
        value: function() {
            var self = this;
            self.element.addEventListener("keydown", self);
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
                newEvent.initEvent("refreshResults", true, false);
                newEvent.searchString = self.resultsSearchBox.value;

                self.dispatchEvent(newEvent);
        }
    },

    toggleSearchOptions: {
        value: function(event) {
            var self = this;
            self.searchOptionsVisible = !self._searchOptionsVisible;
        }
    }
});
