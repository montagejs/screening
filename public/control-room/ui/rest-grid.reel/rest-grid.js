/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage,
    Component = require("montage/ui/component").Component;

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

    prepareForDraw: {
        value: function() {
            var self = this;
            var t = self.dataTable;

            // Create thead from column names
            var head = document.createElement("thead");
            var headRow = document.createElement("tr");
            self.columns.forEach(function(column) {
                var headColumn = document.createElement("th");
                var headColumnText = document.createTextNode(column);
                headColumn.appendChild(headColumnText);
                headRow.appendChild(headColumn);
            });

            head.appendChild(headRow);
            t.appendChild(head);
        }
    }
});
