/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
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
 
                            if(event.target.status === 200){
                                self._dispatchUploadEvent(event, script)
                            
                                Alert.show("Your Script has been added", function() {
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