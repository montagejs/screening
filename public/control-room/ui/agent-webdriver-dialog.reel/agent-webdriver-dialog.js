var Montage = require("montage").Montage;
var Component = require("montage/ui/component").Component;
var Notifier = require("montage/ui/popup/notifier.reel").Notifier;

exports.AgentWebdriverDialog = Montage.create(Component, {
    hasTemplate: {value: true},

    url: {
        value: "http://localhost:9515"
    },

    browserName: {
        value: null
    },

    templateDidLoad: {
        value: function() {
            var self = this;
        }
    },

    handleOkAction: {
        value: function(event) {
            var self = this;

            var urlAndBrowserName = {
                url: self.url,
                browserName: self.browserName.contentController.selectedObjects[0].value
            };

            var anEvent = document.createEvent("CustomEvent");
            anEvent.initCustomEvent("message.ok", true, true, urlAndBrowserName);

            this.dispatchEvent(anEvent);
            this.popup.hide();
        }
    },

    handleCancelAction: {
        value: function() {
            var self = this;
            self.popup.hide();
        }
    }
});
