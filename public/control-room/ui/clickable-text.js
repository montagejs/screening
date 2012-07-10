/* <copyright>
Copyright (c) 2012, Motorola Mobility LLC.
All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of Motorola Mobility LLC nor the names of its
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
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

                        var testResultsUrl = "/screening/api/v1/test_results/" + self._value.id + "?api_key=5150";
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
