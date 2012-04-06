/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage,
    Component = require("montage/ui/component").Component,
    Repetition = require("montage/ui/repetition.reel").Repetition,
    DynamicText = require("montage/ui/dynamic-text.reel").DynamicText,
    Checkbox = require("montage/ui/checkbox.reel").Checkbox;

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
            // First column (selection checkbox)
            var selTh = document.createElement("th");
            headRow.appendChild(selTh);
            // Rest of the columns
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
            // First column (selection checkbox)
            var tdSelectRow = document.createElement("td");
            var checkboxElement = document.createElement("input");
            checkboxElement.type = "checkbox";
            checkboxElement.id = "selectRow";
            tdSelectRow.appendChild(checkboxElement);
            trElement.appendChild(tdSelectRow);
            // Rest of the columns
            var colTds = [];
            self._columns.forEach(function(column, index) {
                var colTd = document.createElement("td");
                colTd.id = "col" + index;
                trElement.appendChild(colTd);
                colTds.push(colTd);
            });

            repetitionElement.appendChild(trElement);

            // Append head and repetitionElement to table
            t.appendChild(head);
            t.appendChild(repetitionElement);

            /*
            Declare Montage components
             */
            // Create components and set properties
            var checkbox = Checkbox.create();
            checkbox.element = checkboxElement;

            var colComponents = [];
            colTds.forEach(function(colTd) {
                var colComponent = DynamicText.create();
                colComponent.element = colTd;
                colComponents.push(colComponent);
            });

            self._repetition = Repetition.create();
            self._repetition.element = repetitionElement;
            self._repetition.isSelectionEnabled = false;
            self._repetition.axis = "horizontal";

            // Attach child components to parents
            checkbox.attachToParentComponent();
            colComponents.forEach(function(colComponent, index) {
                colComponent.attachToParentComponent();

                Object.defineBinding(colComponent, "value", {
                    "boundObject": self._repetition,
                    "boundObjectPropertyPath": "objectAtCurrentIteration." + self._columns[index],
                    "oneway": true});
            });

            // Request a draw for the main component
            self._repetition.needsDraw = true;
        }
    },

    dataMapper: {
        value: function(elem) {
            return elem;
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
                self._repetition.objects = data.map(self.dataMapper);
            };

            var url = self._restResourceUrl + '&limit=3';
            xhr.open("GET", url);
            xhr.send();
        }
    }
});
