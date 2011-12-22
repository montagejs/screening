/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */

/*
 * This file will be executed on a webdriver client to give it recording support. 
 * Since it is run client-side, no requires or external scripts may be used.
 *
 * This file contains no support for playback of events, only recording them.
 */

function parseUrl(url) {
    var portPos = url.lastIndexOf(":");
    var domain = portPos != -1 ? url.substring(0, portPos) : url;
    var port = portPos != -1 ? url.substring(portPos+1) : "80";
    return {
        domain: domain,
        port: port,
    };
};

var server = parseUrl(arguments[0]);
var agentId = arguments[1];

// If RECORD_INPUT_ONLY is true, only events in this whitelist will be recorded
var eventWhitelist = [
    "mousedown", "mousemove", "mouseup", 
    /*"click", "dblclick", "mousewheel",*/
    "keydown", "textInput",
    "touchstart", "touchend", "touchmove",
    /*"focus",*/ "scroll", "resize",
    "drag", "dragover", "dragend",
];

var propertyWhitelist = [
    "detail", "pageX", "pageY", "scrollLeft", "scrollTop",
    "ctrlKey", "altKey", "shiftKey", "metaKey", "button",
    "keyCode", "scale", "rotation", "value",
    "wheelDeltaX", "wheelDeltaY", "data"
];

var EventUtility = Object.create(Object, {
    _listening: {
        enumerable: false,
        value: false
    },
    
    listening: {
        get: function() {
            return this._listening;
        },
        set: function(value) {
            if(!this._listening && value) {
                this.startListening();
            } else if(this._listening && !value) {
                this.stopListening();
            }
        }
    },
    
    _lastEvent: {
        value: null
    },
    
    _attachedWindow: {
        enumerable: false,
        value: null
    },
    
    _attachedIframe: {
        enumerable: false,
        value: null
    },
    
    _eventListener: {
        enumerable: false,
        value: null
    },
    
    _navigateListener: {
        enumerable: false,
        value: null
    },
    
    socket: {
        value: null
    },
    
    /**
    * Start listening for events on the specified window.
    * If no window is specified, will attach to the current document's window
    */
    startListening: {
        value: function(targetWindow) {
            if(this.listening) {
                throw new Error("Already listening for events.");
            }
            
            this._attachedWindow = null;
            
            if(!targetWindow) {
                targetWindow = document.window;
            }
            
            var self = this;
            if(!this._eventListener) {
                this._eventListener = this.willDistributeEvent.bind(this);
            }
            
            eventWhitelist.forEach(function(evtName){
                targetWindow.addEventListener(evtName, self._eventListener, true);
            });
            
            this._attachedWindow = targetWindow;
            this._listening = true;
            this._dispatchResizeCaptured(); // Capture the initial window size
        }
    },
    
    /**
    * Stop listening for events.
    */
    stopListening: {
        value: function() {
            var targetWindow = this._attachedWindow;
            if(targetWindow == null) {
                return;
            }
            
            var self = this;
            eventWhitelist.forEach(function(evtName){
                targetWindow.removeEventListener(evtName, self._eventListener, true);
            });
            
            this._listening = false;
        }
    },
    
    pauseListening: {
        value: function() {
            this._listening = false;
        }
    },
    
    resumeListening: {
        value: function() {
            this._listening = true;
        }
    },
    
    /**
    * Called when montage fires any event while listening. Converts the event into a consumable object and dispatches an "eventcaptured" event.
    * @param event The original event that was fired
    */
    willDistributeEvent: {
        enumerable: false,
        value: function(event) {
            // Resize is handled a little differently
            if(event.type == "resize") {
                this._dispatchResizeCaptured();
                return;
            }
            
            // Filter out events that don't have a target element (how can we replay them?)
            if(!event.target || !event.target.ownerDocument) {
                return;
            }
            
            // TODO: I'm not certain that this is the best design decision, but it'll have to do for now. Without this, we capture twice in some cases. (Capture AND bubbling)
            if(event.eventPhase === 0) {
                return;
            }
            
            // It seems that it's very easy for us to get into states where the event listener gets doubled up. Seems to be app-dependant.
            // Check to make sure we aren't re-recording the last event.
            if(event === this._lastEvent) {
                return;
            }
            this._lastEvent = event;
            
            // If in RECORD_INPUT_ONLY mode, filter out non-whitelist events
            if(eventWhitelist.indexOf(event.type) === -1) {
                return;
            }
            
            var eventObj = this.serializeEvent(event);
            if(eventObj) {
                this._dispatchEventCaptured(eventObj);
            }
        }
    },
    
    /**
    * Translates a native javascript event into a JSON serializable object
    * @param event Native javascript event to serialize
    * @returns JSON serializable object
    */
    serializeEvent: {
        value: function(event) {
            var nativeEvent = event._event || event;
            var self = this;
            
            var obj = {
                type: event.type,
                target: self.serializeTarget(event.target.ownerDocument, event.target),
                timeStamp: event.timeStamp,
                bubbles: event.bubbles,
                cancelable: event.cancelable,
                arguments: {}
            };
            
            // change is a special case. It's the only event we get for some input fields,
            // but has no value data associated with it. As such, we have to read the content of the 
            // field and use that instead
            if(obj.type == "input" || obj.type == "change") {
                if(obj.target.type == "checkbox") {
                    obj.arguments.checked = (event.target.checked ? true : false);
                } else {
                    obj.arguments.value = event.target.value;
                }
            }
            
            // scroll events have no associated data, they only indicate that a scroll occurred
            // so we go grab the scroll information ourselves
            if(obj.type == "scroll") {
                obj.arguments.scrollTop = event.target.scrollTop;
                obj.arguments.scrollLeft = event.target.scrollLeft;
            }

            // If this is one of the touch events, we need to take special actions to serialize the touch list
            if(obj.type.indexOf("touch") == 0) {
                if(nativeEvent.touches) {
                    var touches = this.serializeTouchList(nativeEvent.touches, event.target);
                    if(touches) {
                        obj.arguments.touches = touches;
                    }
                }
                if(nativeEvent.targetTouches) {
                    var touches = this.serializeTouchList(nativeEvent.targetTouches, event.target); 
                    if(touches) {
                        obj.arguments.targetTouches = touches;
                    } 
                }
                if(nativeEvent.changedTouches) {
                    var touches = this.serializeTouchList(nativeEvent.changedTouches, event.target); 
                    if(touches) {
                        obj.arguments.changedTouches = touches;
                    }
                }
            }
            
            if(obj.type === "click" || obj.type === "dblclick" || obj.type === "mousedown" || obj.type === "mouseup" || obj.type === "dragend") {
                var pos = this.serializeElementPosition(event.target, event);
                if(pos) {
                    obj.arguments.elementX = pos[0];
                    obj.arguments.elementY = pos[1];
                }
            }

            // Loop through the keys on the event object and copy over any that may be of interest to us
            for(key in nativeEvent) {
               var value = nativeEvent[key];
               if (typeof value === "function") {
                   // Don't serialize event methods
                   continue;
               }

               if(propertyWhitelist.indexOf(key) != -1) {
                   // Exclude elements that contain null, false, 0, or empty string values.
                   // TODO: This may cause issues. We may need a whitelist of attributes that are always written out.
                   if(nativeEvent[key]) { 
                       obj.arguments[key] = nativeEvent[key];
                   }
               }
            }
            
            return obj;
        }
    },
    
    /**
    * Translates a TouchList array into JSON serializable objects
    * @param touchList A native TouchList object from a touch event
    * @returns JSON serializable object
    */
    serializeTouchList: {
        value: function(touchList, eventTarget) {
            var touches = [];
            
            for(var i = 0; i < touchList.length; ++i) {
                var touch = touchList[i];
                touches[i] = {
                    pageX: touch.pageX,
                    pageY: touch.pageY,
                    screenX: touch.screenX,
                    screenY: touch.screenY,
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    radiusX: touch.radiusX,
                    radiusY: touch.radiusY,
                    rotation: touch.rotation,
                    scale: touch.scale,
                    identifier: touch.identifier,
                };
                
                // To reduce serialization complexity, if the touch target is the same as the event target we won't serialize
                if(touch.target && touch.target != eventTarget) {
                    touches[i].target = serializeTarget(touch.target.ownerDocument, touch.target);
                }
            }
            
            if(touches.length) {
                return touches;
            }
            
            return null;
        }
    },
    
    /**
    * Translates a page X/Y position into a coordinate relative to the given element
    * @param eventTarget Element to calculate t
    * @returns JSON serializable object
    */
    serializeElementPosition: {
        value: function(element, event) {
            if(event.pageX == undefined && event.pageY == undefined) { return null; }
            
            if(webkitConvertPointFromPageToNode) {
                var offset = webkitConvertPointFromPageToNode(element, new WebKitPoint(event.pageX,event.pageY));
                return [offset.x, offset.y];
            } else {
                var offsetX = event.pageX;
                    offsetY = event.pageY;
                
                while(element) {
                    offsetX -= element.offsetLeft;
                    offsetY -= element.offsetTop;
                    element = element.offsetParent;
                }
            
                return [offsetX, offsetY];
            }
        }
    },
    
    /**
    * This function attempts to generate the smallest XPath possible that uniquely identifies the
    * element that it has been given. It is only guaranteed to be unique for the DOM as it exists at the time this
    * function was called.
    * @param doc The owner document for the given element
    * @param element The element to generate a path for
    * @returns An XPath that uniquely identifies the given element
    */
    serializeTarget: {
        value: function(doc, element) {
            if(element == doc || !element) {
                return "/";
            }

            var nodeList;
            if(element.id) {
                nodeList = doc.evaluate("//*[@id='" + element.id + "']", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                if(nodeList.snapshotLength == 1) {
                    return "//*[@id='" + element.id + "']";
                }
            }

            var parentSelector = "",
            relativeElement = doc;

            if(element.parentNode != doc) {
                parentSelector = this.serializeTarget(doc, element.parentNode);
                // TODO: extract our evaluate someplace so changes are easier
                relativeElement = doc.evaluate(parentSelector, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
            }

            nodeList = doc.evaluate(element.nodeName, relativeElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            if(nodeList.snapshotLength == 1) {
                return (parentSelector + "/" + element.nodeName).trim();
            } else {
                for(var i = 0; i < nodeList.snapshotLength; ++i) {
                    if(element == nodeList.snapshotItem(i)) {
                        return (parentSelector + "/" + element.nodeName + "[" + (i+1) + "]").trim();
                    }
                }

                throw new Error("Node not found by tag name");
            }
        }
    },
    
    _dispatchResizeCaptured: {
        enumerable: false,
        value: function() {
            if(!this._listening) { return; }
            this.socket.emit("resizeCaptured", this._attachedWindow.innerWidth, this._attachedWindow.innerHeight);
        }
    },
    
    _dispatchNavigateCaptured: {
        enumerable: false,
        value: function(url) {
            if(!this._listening) { return; }
            this.socket.emit("navigateCaptured", url);
        }
    },
    
    _dispatchEventCaptured: {
        enumerable: false,
        value: function(eventObj) {
            if(!this._listening) { return; }
            this.socket.emit("eventCaptured", eventObj);
        }
    }
});

function injectScript(src, callback) {
    var a = document, 
        b = a.createElement('script');
    b.src = src;
    b.onload = callback;
    a.head.appendChild(b);
};

//
// Main script execution
//

var eventUtil = Object.create(EventUtility);

console.log("Connecting to " + server.domain + ":" + server.port);

// Include socket.io and setup the socket connection
injectScript(server.domain + ":" + server.port + "/screening/socket.io/socket.io.js", function() {
    var socket = io.connect(server.domain + ":8081", { resource: "screening/socket.io" });
    eventUtil.socket = socket; // Meh, this isn't the most elegant solution...
    socket.emit("initRecorder", agentId); // Tell the server that we're available for recording

    // Implicitly start recording immediately
    //eventUtil.startListening(window);

    // Start listening to events fired by the page in the iFrame and relay those events to the server
    // NOTE: With webdriver this should never happen
    socket.on("startRecord", function () {
        console.log("Recording Starting");
        eventUtil.startListening(window);
    });

    // Stop listening to events
    socket.on("stopRecord", function (callback) {
        console.log("Recording Stopped");
        eventUtil.stopListening();
        if(callback) { callback(); }
    });

    // Pause listening to events
    socket.on("pauseRecord", function (callback) {
        // TODO: DOM inspector?
        console.log("Recording Paused");
        eventUtil.pauseListening();
        if(callback) { callback(); }
    });

    // Resume listening to events
    socket.on("resumeRecord", function (callback) {
        console.log("Recording Resumed");
        eventUtil.resumeListening();
        if(callback) { callback(); }
    });
});
