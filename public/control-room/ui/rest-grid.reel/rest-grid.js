/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage,
    Component = require("montage/ui/component").Component,
    Repetition = require("montage/ui/repetition.reel").Repetition;

exports.RestGrid = Montage.create(Component, {
    _dataTable: { value: null },
    dataTable: {
        get: function() {
            return this._dataTable;
        },
        set: function(dataTable) {
            this._dataTable = dataTable;
        }
    },

    _columns: { value: null },
    columns: {
        get: function() {
            return this._columns;
        },
        set: function(columns) {
            this._columns = columns;
        }
    },

    _restResourceUrl: { value: null },
    restResourceUrl: {
        get: function() {
            return this._restResourceUrl;
        },
        set: function(restResourceUrl) {
            this._restResourceUrl = restResourceUrl;
        }
    },

    templateDidLoad: {
        value: function() {
            var self = this;

            // Repetition element
            var repetitionElement = document.createElement("tbody");

            self._repetition = Montage.create(Repetition, {
                element: {
                    value: repetitionElement
                }
            });
        }
    },

    draw: {
        value: function() {
            var self = this;
            var t = self.dataTable;

            // Create thead from column names
            var head = document.createElement("thead");
            var headRow = document.createElement("tr");
            self._columns.forEach(function(column) {
                var headColumn = document.createElement("th");
                var headColumnText = document.createTextNode(column);
                headColumn.appendChild(headColumnText);
                headRow.appendChild(headColumn);
            });
            head.appendChild(headRow);

            // Get the data from restResourceUrl
            var xhr = new XMLHttpRequest();

            xhr.onload = function(event) {
                // Parse the response
                var data = JSON.parse(event.target.responseText);

                console.log(data);
            };

            var url = self._restResourceUrl + '&limit=3';
            xhr.open("GET", url);
            xhr.send();

            // append the remaining parts to the main table
            t.appendChild(head);
        }
    }
});
