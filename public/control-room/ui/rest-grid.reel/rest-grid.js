/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage,
    Component = require("montage/ui/component").Component,
    Repetition = require("montage/ui/repetition.reel").Repetition,
    DynamicText = require("montage/ui/dynamic-text.reel").DynamicText;

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
            var t = self._dataTable;

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

            // Repetition element (tbody)
            var repetitionElement = document.createElement("tbody");
            repetitionElement.id = "tableData";
            var trElement = document.createElement("tr");
            var tdElement = document.createElement("td");
            tdElement.id = "testcaseName";
            tdElement.colSpan = 7;

            trElement.appendChild(tdElement);
            repetitionElement.appendChild(trElement);

            // Append head and repetitionElement to table
            t.appendChild(head);
            t.appendChild(repetitionElement);

            /*
            Declare Montage components
             */

            // Create components and set properties
            var nameDyn = DynamicText.create();
            nameDyn.element = tdElement;

            self._repetition = Repetition.create();
            self._repetition.element = repetitionElement;
            self._repetition.isSelectionEnabled = false;
            self._repetition.axis = "horizontal";
            self._repetition.objects = [1,2,3,4,5];

            // Attach child components to parents
            nameDyn.attachToParentComponent();

            // Define the bindings
            Object.defineBinding(nameDyn, "value", {
                "boundObject": self._repetition,
                "boundObjectPropertyPath": "objectAtCurrentIteration",
                "oneway": true});

            // Request a draw for the main component
            self._repetition.needsDraw = true;
        }
    },

    draw: {
        value: function() {
            var self = this;
            var t = self._dataTable;

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
        }
    }
});
