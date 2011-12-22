/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage,
    DynamicText = require("montage/ui/dynamic-text.reel").DynamicText,
    TextPrompt = require("common/ui/text-prompt.reel").TextPrompt,
    Popup = require ("montage/ui/popup/popup.reel").Popup;

exports.ClickableText = Montage.create(DynamicText, {
    hasTemplate: {
        value: false
    },

    _propertyToDisplay: {
        enumerable: false,
        value: null
    },

    propertyToDisplay: {
        serializable: true,
        enumerable: true,
        get: function() {
            return this._propertyToDisplay;
        },
        set: function(value) {
            this._propertyToDisplay = value;
        }
    },

    prepareForDraw: {
        value: function() {
            var self = this;
            var clickListener = {
                handleClick: function(event) {
                    console.log(self._value.id);
                    var testcaseNamePrompt = Montage.create(TextPrompt);
                    testcaseNamePrompt.msg = "Enter new name";
                    testcaseNamePrompt.value = self._value.name;

                    var promptEl = document.createElement('div');
                    promptEl.setAttribute('id', 'prompt-dialog-content');
                    promptEl.style['width'] = '400px';
                    promptEl.style['height'] = 'auto';
                    document.body.appendChild(promptEl);
                    testcaseNamePrompt.element = promptEl;

                    testcaseNamePrompt.addEventListener("message.ok", function(event) {
                        var newName = event.target.value;
                        var xhr = new XMLHttpRequest();

                        xhr.addEventListener("load", function(evt) {
                            // Parse the response from /test_results
                            var data = JSON.parse(evt.target.responseText);
                            console.log("result of PUT: ", data);
                        }, false);

                        var testResultsUrl = "/screening/api/v1/test_results/" + self._value.id;
                        xhr.open("PUT", testResultsUrl);

                        xhr.setRequestHeader("Content-Type", "application/json");
                        xhr.send(JSON.stringify({name: newName}));

                        self._value.name = newName;
                        self.needsDraw = true;
                    });
                    var popup = Popup.create();
                    popup.content = testcaseNamePrompt; // the content inside the Popup
                    popup.modal = true;
                    popup.show();
                }
            };
            this.element.addEventListener("click", clickListener);
        }
    },

    draw: {
        value: function() {
            this.element.innerText = this._value[this._propertyToDisplay] != null ? this._value[this._propertyToDisplay] : this.defaultValue;
        }
    }
});
