/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage,
    Component = require("montage/ui/component").Component,
    Alert = require ("montage/ui/popup/alert.reel").Alert;

exports.ScriptResultsView = Montage.create(Component, {
    _results: {
        enumerable: false,
        value: []
    },

    _pageSize: {
        enumerable: false,
        value: 10
    },

    _currentPage: {
        enumerable: false,
        value: null
    },

    _totalPages: {
        enumerable: false,
        value: undefined
    },

    _baseResultsUrl : {
        enumerable: false,
        value: "/screening/api/v1/test_results?api_key=5150"
    },

    results: {
        enumerable: true,
        get: function() {
            return this._results;
        },
        set: function(value) {
            this._results = value;
        }
    },

    pageSize: {
        enumerable: true,
        get: function() {
            return this._pageSize;
        },
        set: function(value) {
            this._pageSize = value;
        }
    },

    currentPage: {
        enumerable: true,
        get: function() {
            return this._currentPage;
        },
        set: function(value) {
            var self = this;
            
            value = parseInt(value);
            //console.log("setCurrentPage", value);
            self._currentPage = value < 1 ? 1 : value;

            var resultsUrl = self._baseResultsUrl;
            if(self.scriptResultsSearch.resultsSearchBox && self.scriptResultsSearch.resultsSearchBox.value) {
                resultsUrl += "&any=" + self.scriptResultsSearch.resultsSearchBox.value;
            }

            self.renderResults(resultsUrl);

            // Disable/Enable page buttons if we are on the first/last pages
            self.previousPageButtonTop.disabled = (self._currentPage === 1);
            self.nextPageButtonTop.disabled = (self._currentPage === self._totalPages);
        }
    },

    totalPages: {
        enumerable:true,
        get: function() {
            return this._totalPages;
        },
        set: function(value) {
            this._totalPages = parseInt(value);

            this.currentPageTextField.element.setAttribute("max", this._totalPages);
        }
    },

    isAtLeastOneSelected: {
        value: function() {
            var self = this;

            return self._results.some(function(elem) {
                return elem.selected;
            });
        }
    },

    selectedResults: {
        value: function() {
            var self = this;

            var selRes = [];
            self._results.forEach(function(elem, i) {
                if (elem.selected) {
                    selRes.push({index: i, object: elem});
                }
            });
            return selRes;
        }
    },

    deleteResults: {
        value: function(event) {
            var self = this;

            // Verify that at least one element is selected
            var atLeastOneSelected = self.isAtLeastOneSelected();
            if (!atLeastOneSelected) {
                Alert.show("You must select at least one Testcase result to delete.");
                return;
            }

            var selectedResults = self.selectedResults();

            var ids = selectedResults.map(function(elem) {
                return elem.object.id;
            });

            var xhr = new XMLHttpRequest();
            xhr.open("DELETE", "/screening/api/v1/test_results/multiple?api_key=5150");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify({
                ids: ids
            }));

            xhr.addEventListener("load", function(evt) {
                //TODO: Less than ideal, it should dynamically update the repetition (table)
                location.reload(true);
            });
        }
    },
    
    selectAllResults: {
        value: function(event) {
            var self = this;
            var selectedStatus = !self.isAtLeastOneSelected();

            self._results.forEach(function(elem, i) {
                elem.selected = selectedStatus;
            });
        }
    },

    nextPage: {
        value: function(event) {
            var self = this;

            self.currentPage = self._currentPage < self._totalPages ? self._currentPage + 1 : self._totalPages;
        }
    },

    previousPage: {
        value: function(event) {
            var self = this;

            self.currentPage = self.currentPage == 1 ? 1 : self.currentPage - 1;
        }
    },

    selectAllButton: {
        enumerable: false
    },

    currentPageTextField: {
        enumerable: false
    },

    previousPageButtonTop: {
        enumerable: false
    },

    nextPageButtonTop: {
        enumerable: false
    },

    scriptResultsSearch: {
        enumerable: false
    },

    handleRefreshResults: {
        value: function(event) {
            var self = this;

            console.log(event.searchString);

            var testResultsUrl = self._baseResultsUrl;
            if (event.searchString) {
                testResultsUrl += "&any=" + event.searchString;
            }

            self.calculateTotalPages(event.searchString, function() {
                self.currentPage = 1;
                //self.renderResults(testResultsUrl);
            });
        }
    },

    renderResults: {
        value: function(testResultsUrl) {
            var self = this;
            var xhr = new XMLHttpRequest();

            // Clear all the results from the table
            while (self._results.pop());

            // Add pagination support
            testResultsUrl += "&limit=" + self._pageSize + "&skip=" + ((self._currentPage - 1) * self._pageSize);

            xhr.onload = function(event) {
                // Parse the response from /test_results
                var data = JSON.parse(event.target.responseText);

                data.forEach(function (res) {
                    self._results.push({
                        selected: false,
                        id: res._id,
                        name: res.name,
                        agent: res.agent,
                        script: res.testcase.name,
                        summary: res.status,
                        startTime: res.startTime,
                        endTime: res.endTime,
                        resultUrl: "script-result.html?" + res._id
                    });
                });
            }

            xhr.open("GET", testResultsUrl);
            xhr.send();
        }
    },

    prepareForDraw: {
        value: function() {
            var self = this;

            self.calculateTotalPages(null, function() {
                self.currentPage = 1;
            });
        }
    },

    calculateTotalPages: {
        value: function(searchString, cb) {
            var self = this;

            var metadataUrl = "/screening/api/v1/test_results/metadata?api_key=5150"
            if(searchString) {
                metadataUrl += "&any=" + searchString;
            }

            var xhr = new XMLHttpRequest();
            xhr.onload = function(event) {
                var data = JSON.parse(event.target.responseText);

                self.totalPages = Math.ceil(data.count / self.pageSize);
                cb();
            }
            xhr.open("GET", metadataUrl);
            xhr.send();
        }
    }
});
