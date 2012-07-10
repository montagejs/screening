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
                };

                webdriverParams.crxFileName = self.crxFile.element.files[0].name;

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
