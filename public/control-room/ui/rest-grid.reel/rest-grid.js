/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */

// NOTE: I'm using montage/ui/rest-grid as the module, this is subject to change. - Eliseo

/**
 *  @module montage/ui/rest-grid
 *  @requires montage/core/core
 *  @requires montage/ui/component
 *  @requires montage/ui/repetition
 *  @requires montage/ui/dynamic-text
 *  @requires montage/ui/checkbox
 *  @requires montage/ui/anchor
 */
var Montage = require("montage/core/core").Montage,
    Component = require("montage/ui/component").Component,
    Repetition = require("montage/ui/repetition.reel").Repetition,
    DynamicText = require("montage/ui/dynamic-text.reel").DynamicText,
    Checkbox = require("montage/ui/checkbox.reel").Checkbox,
    Anchor = require("montage/ui/anchor.reel").Anchor;

/**
 * @class module:montage/ui/rest-grid.RestGrid
 * @classdesc Main class for the RestGrid component
 * @extends module:montage/core/core.Component
 */
exports.RestGrid = Montage.create(Component, /** @lends module:montage/ui/rest-grid.RestGrid# */ {
    _dataTable: { value: null },
    /**
     * The DOM <table> where the content is going to be rendered
     * @type {object}
     */
    dataTable: {
        get: function() {
            return this._dataTable;
        },
        set: function(dataTable) {
            this._dataTable = dataTable;
        }
    },

    _columns: { value: null },
    /**
     * Array of column definitions in the following format:
     * [ {"property": "pathToObjectProperty", "label": "LabelToDisplay"}, ... ]
     * The label property can be ommited, in that case the label will be "property"
     * @type {array}
     */
    columns: {
        get: function() {
            return this._columns;
        },
        set: function(columns) {
            this._columns = this._normalizeColumns(columns);
        }
    },

    _pageSize: { value: 10},
    /**
     * Maximum number of row elements to display
     * @type {number}
     * @default 10
     */
    pageSize: {
        enumerable: true,
        get: function() {
            return this._pageSize;
        },
        set: function(value) {
            this._pageSize = parseInt(value);
        }
    },

    _currentPage: {value: 1},
    /**
     * Gets/Sets the current page to be displayed. Redraws the component to display the contents of the page specified.
     * @type {number}
     */
    currentPage: {
        enumerable: true,
        get: function() {
            return this._currentPage;
        },
        set: function(value) {
            var self = this;

            value = parseInt(value);
            self._currentPage = value < 1 ? 1 : value;

            self.needsDraw = true;

            // Disable/Enable page buttons if we are on the first/last pages
//            self.previousPageButtonTop.disabled = (self._currentPage === 1);
//            self.nextPageButtonTop.disabled = (self._currentPage === self._totalPages);
        }
    },

    _restResourceUrl: { value: null },
    /**
     * The base URL of the REST data source.
     * @type {string}
     */
    restResourceUrl: {
        get: function() {
            return this._restResourceUrl;
        },
        set: function(restResourceUrl) {
            this._restResourceUrl = restResourceUrl;
        }
    },

    /**
     * Modifies a column definition array and makes sure that each column has a property and label.
     * @private
     * @function
     * @param {array} the column definition array
     * @returns {array} the normalized column definition array
     */
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

    /**
     * Internally used to add the required parameters to the HTTP request that retrieves the data from the REST
     * endpoint.
     * @private
     * @function
     */
    constructUrl: {
        value: function _constructUrl() {
            var url = this._restResourceUrl + '&limit=' + this._pageSize;

            // Add pagination support
            url = url + "&skip=" + ((this._currentPage - 1) * this._pageSize);

            return url;
        }
    },

    /**
     * User modifiable function that modifies an object obtained from the REST endpoint.
     * Useful for stripping out unused properties or to calculate custom properties.
     * @function
     * @param {object}
     */
    dataMapper: {
        value: function(elem) {
            return elem;
        }
    },

    /**
     * Gets the selected items from the list as an object array that contains the element and it's position index
     * relative to the current page
     * @type {array}
     */
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

    /**
     * Similar to selectedObjects but returns only the selected elements without the index.
     * @see module:montage/ui/rest-grid.RestGrid.selectedObjects
     * @type {array}
     */
    selectedElements: {
        get: function() {
            return this.selectedObjects.map(function(elem) {
                return elem.element;
            });
        }
    },

    /**
     * Similar to selectedObjects but returns only the selected indexes
     * @see module:montage/ui/rest-grid.RestGrid.selectedObjects
     * @type {array}
     */
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

    /**
     * Dynamically creates all the DOM Elements and Montage Components required to render a RestGrid
     * @function
     */
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
                var headLink = document.createElement("a");
                headColumn.appendChild(headLink);
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
            // Links on Column names
            var colAnchors = [];
            self._columns.forEach(function(column, index) {
                var colAnchor = Anchor.create();
                colAnchor.element = headRow.children[index + 1].firstChild;
                colAnchor.element.columnIndex = index;
                colAnchors.push(colAnchor);
            });

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

            var clickListener = function(event) {
                console.log("clickFun", event.currentTarget.columnIndex);
            }

            colAnchors.forEach(function(colAnchor, index) {
                colAnchor.attachToParentComponent();
                colAnchor.element.addEventListener("click", clickListener, false);
                colAnchor.textContent = self._columns[index].label;
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

    /**
     * Performs the HTTP Request to the REST endpoint to get the data.
     * @function
     */
    draw: {
        value: function() {
            var self = this;
            var t = self._dataTable;

            //console.log("draw!");

            // Get the data from restResourceUrl
            var xhr = new XMLHttpRequest();

            xhr.onload = function(event) {
                // Parse the response
                var data = JSON.parse(event.target.responseText);

                self._repetition.objects = data.map(self.dataMapper);
            };

            var url = self.constructUrl();
            xhr.open("GET", url);
            xhr.send();
        }
    }
});
