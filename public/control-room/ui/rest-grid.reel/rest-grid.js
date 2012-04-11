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
            this._columns = this._normalizeColumns(columns);
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

    _normalizeColumns: {
        enumerable: false,
        value: function(columns) {
            if (!Array.isArray(columns)) {
                throw Error("columns property must be an array!");
            }

            // Convert the column spec to property/label
            return columns.map(function(column) {
                if (Object.prototype.toString.call(column) === '[object Object]') {
                    return {property: column.property, label: column.label};
                } else {
                    return {property: column.toString(), label: column.toString()};
                }
            });
        }
    },

    dataMapper: {
        value: function(elem) {
            return elem;
        }
    },

    selectedObjects: {
        get: function() {
            var selObjs = [];

            this._repetition.objects.forEach(function(elem, index) {
                if(elem.__selected) {
                    selObjs.push({element: elem, index: index});
                }
            });

            return selObjs;
        }
    },

    selectedElements: {
        get: function() {
            return this.selectedObjects.map(function(elem) {
                return elem.element;
            });
        }
    },

    selectedIndexes: {
        get: function() {
            return this.selectedObjects.map(function(elem) {
                return elem.index;
            });
        }
    },

    templateDidLoad: {
        value: function() {
        }
    },

    prepareForDraw: {
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
                var headColumnText = document.createTextNode(column.label);
                headColumn.appendChild(headColumnText);
                headRow.appendChild(headColumn);
            });
            head.appendChild(headRow);

            // Repetition element (tbody)
            var repetitionElement = document.createElement("tbody");
            repetitionElement.setAttribute('data-montage-id', 'tableData');
            var trElement = document.createElement("tr");
            // First column (selection checkbox)
            var tdSelectRow = document.createElement("td");
            var checkboxElement = document.createElement("input");
            checkboxElement.type = "checkbox";
            checkboxElement.setAttribute('data-montage-id', 'selectRow');
            tdSelectRow.appendChild(checkboxElement);
            trElement.appendChild(tdSelectRow);
            // Rest of the columns
            var colTds = [];
            self._columns.forEach(function(column, index) {
                var colTd = document.createElement("td");
                colTd.setAttribute('data-montage-id', 'col' + index);
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
            self._repetition.isSelectionEnabled = true;
            self._repetition.axis = "horizontal";

            // Attach child components to parents and bind
            checkbox.attachToParentComponent();
            Object.defineBinding(checkbox, "checked", {
                "boundObject": self._repetition,
                "boundObjectPropertyPath": "objectAtCurrentIteration.__selected",
                "oneway": false
            });

            colComponents.forEach(function(colComponent, index) {
                colComponent.attachToParentComponent();

                Object.defineBinding(colComponent, "value", {
                    "boundObject": self._repetition,
                    "boundObjectPropertyPath": "objectAtCurrentIteration." + self._columns[index].property,
                    "oneway": true});
            });

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
                self._repetition.objects = data.map(self.dataMapper);
            };

            var url = self._restResourceUrl + '&limit=30';
            xhr.open("GET", url);
            xhr.send();
        }
    }
});
