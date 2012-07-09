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

var Montage = require("montage").Montage;
var Component = require("montage/ui/component").Component;
var Notifier = require("montage/ui/popup/notifier.reel").Notifier;

exports.AgentWebdriverDialog = Montage.create(Component, {
    hasTemplate: {value: true},

    url: {
        value: "http://localhost:9515"
    },

    browserName: {
        value: null, serializable: true
    },

    crxFile: {value: null, serializable: true},

    templateDidLoad: {
        value: function() {
            var self = this;
        }
    },

    handleOkAction: {
        value: function(event) {
            var self = this;

            var webdriverParams = {
                url: self.url,
                browserName: self.browserName.contentController.selectedObjects[0].value
            };

            var dispatchAndHide = function() {
                var anEvent = document.createEvent("CustomEvent");
                anEvent.initCustomEvent("message.ok", true, true, webdriverParams);
                self.dispatchEvent(anEvent);
                self.popup.hide();
            };

            if(self.crxFile.element.files && self.crxFile.element.files.length > 0) {
                var reader = new FileReader();

                reader.onload = function(readerEvt) {
                    webdriverParams.crxFile = btoa(readerEvt.target.result);
                    dispatchAndHide();
                }

                reader.readAsBinaryString(self.crxFile.element.files[0]);
            } else {
               dispatchAndHide();
            }
        }
    },

    handleCancelAction: {
        value: function() {
            var self = this;
            self.popup.hide();
        }
    }
});
