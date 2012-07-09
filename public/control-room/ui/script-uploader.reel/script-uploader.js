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
    Component = require ("montage/ui/component").Component,
    ScriptSource = require("control-room/script-source").ScriptSource,
    Popup = require('montage/ui/popup/popup.reel').Popup,
    Alert = require ("montage/ui/popup/alert.reel").Alert;

exports.ScriptUploader = Montage.create(Component, {

    _defaultText: {
        value: "Drag Script Here To Upload"
    },

    _drawText: {
        value: ""
    },
    prepareForDraw: {
        value: function() {
            if(window.FileReader) {
                this.element.addEventListener('dragover', this, false);
                this.element.addEventListener('dragenter', this, false);
                this.element.addEventListener('dragleave', this, false);
                this.element.addEventListener('drop', this, false);

                this._drawText = this._defaultText;
            } else {
                this.element.classList.add('unsupported');
                this.element.parentElement.parentElement.classList.add('noUploader');
            }
            this.needsDraw = true;
        }
    },

    draw: {
        value: function() {
            this.element.innerText = this._drawText;
        }
    },

    handleDragover: {
        value: function(event) {
            // Prevent the page from opening in the window
            event.preventDefault();
            this.element.classList.add('dragover');
            this._drawText = "Drag and Drop Script Here to Upload";
            this.needsDraw = true;
            //event.target.innerText =
        }
    },

    handleDragenter: {
        value: function(event) {
            event.preventDefault();
        }
    },

    handleDragleave: {
        value: function(event) {
            this.element.classList.remove('dragover');
            this._drawText = this._defaultText;
            this.needsDraw = true;
        }
    },

    handleDrop: {
        value: function(event) {
            event.preventDefault();
            this.element.classList.remove('dragover');
            this._drawText = this._defaultText;
            this.needsDraw = true;

            var files = event.dataTransfer.files; // FileList object.
            var self = this;

            for ( var i = 0; i < files.length; i++) {
                var f = files[i];

                var reader = new FileReader();

                reader.onload = (function(theFile) {
                    return function(e) {
                        var obj = {
                            name: theFile.name,
                            code: e.target.result
                        };

                        var req = new XMLHttpRequest();
                        req.open("POST", "/screening/api/v1/scripts/?api_key=5150", true);
                        req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                        req.onload = function(event) {
                            var script = JSON.parse(this.responseText);
                            var scriptAddedMsg = (files.length === 1) ? "Your Script has been added" : "Your Scripts have been added";

                            if(event.target.status === 200){
                                self._dispatchUploadEvent(event, script)

                                Alert.show(scriptAddedMsg, function() {
                                    // Maybe select the script in the future.
                                });
                            } else {
                                Alert.show("Your Script WAS NOT Uploaded, it may already exist on the server", function() {
                                    //Maybe do something here in the future
                                })
                            }
                        };
                        req.send(JSON.stringify(obj));
                    };
                })(f);
                reader.readAsText(f);
            }
        }
    },

    _dispatchUploadEvent: {
        enumerable: false,
        value: function(eventObj, script) {
            var event = document.createEvent("CustomEvent");
            event.initCustomEvent("uploadEvent", true, false);
            event.script = script;
            this.dispatchEvent(event);
        }
    }
});
