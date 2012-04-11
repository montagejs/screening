/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage,
    Application = require("montage/ui/application").Application;

exports.ScriptResults = Montage.create(Application, {
    templateDidLoad: {
        value: function() {
            console.log("Application start!!!");
            this.restTable.dataMapper = this.tableDataMapper;
        }
    },

    tableDataMapper: {
        value: function(elem) {
            elem.__selected = false;
            return elem;
        }
    },

    handleRefreshTableAction: {
        value: function() {
            this.restTable.needsDraw = true;
        }
    },

    handlePreviousPageAction: {
      value: function() {
        console.log("Prev. Page");
      }
    },

    handleNextPageAction: {
        value: function() {
            console.log("Next Page");
        }
    },

    handleGetSelectedElementsAction: {
        value: function() {
            var selectedElements = this.restTable.selectedElements;
            console.log("Get selected elements!");
            console.log(selectedElements);
        }
    },

    handleGetSelectedIndexesAction: {
        value: function() {
            var selectedIndexes = this.restTable.selectedIndexes;
            console.log("Get selected indexes!", selectedIndexes);
        }
    }
});