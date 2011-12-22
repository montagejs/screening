/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */

/**
 * Map of key codes to JSON Wire Protocol codes
 */
var KeyMap = {
//    :"CANCEL",
//    :"HELP",
    8:"BACKSPACE",
//    9:"TAB",
    12:"CLEAR",
//    :"RETURN",
    13:"ENTER",
//    16:"SHIFT",
//    17:"CONTROL",
//    18:"ALT",
//    :"PAUSE",
    27:"ESCAPE",
//    :"SPACE",
    33:"PAGEUP",
    33:"PAGEDOWN",
    35:"END",
    36:"HOME",
    37:"LEFT",
    38:"UP",
    39:"RIGHT",
    40:"DOWN",
    45:"INSERT",
    46:"DELETE",
//    :"SEMICOLON",
//    :"EQUALS",
/*    96:"NUM0",
    97:"NUM1",
    98:"NUM2",
    99:"NUM3",
    100:"NUM4",
    101:"NUM5",
    102:"NUM6",
    103:"NUM7",
    104:"NUM8",
    105:"NUM9",
    106:"MULTIPLY",
    107:"ADD",
    108:"SEPARATOR",
    109:"SUBTRACT",
    110:"DECIMAL",
    111:"DIVIDE",*/
    112:"F1",
    113:"F2",
    114:"F3",
    115:"F4",
    116:"F5",
    117:"F6",
    118:"F7",
    119:"F8",
    120:"F9",
    121:"F10",
    122:"F11",
    123:"F12",
    91:"COMMAND",
};

/**
 * Compiles a collection of serialized events into runnable script
 */
var RecordingCompiler = exports.RecordingCompiler = Object.create(Object, {
    
    /**
     * @constructor
     * @this {RecordingCompiler}
     * @param socket Socket connection associated with this agent
     */
    init: {
        value: function(options) {
            this.actionStack = [];
            this.options = {
                enhanceCodeReadibility: true
            };
            // Mixin the options passed to the constructor.
            for (var i in options) this.options[i] = options[i];
            
            return this;
        }
    },
    
    /**
     * Clears the action stack
     */
    clearActions: {
        value: function() {
            this.actionStack = [];
        }
    },
    
    /**
     * Adds a navigate action to the action stack
     * @param url The URL to navigate to
     */
    pushNavigate: {
        value: function(url) {
            this.actionStack.push({
                type: "navigate",
                target: null,
                url: url,
            });
        }
    },
    
    /**
     * Adds a resize action to the action stack
     * @param width Width of the innerWindow in pixels
     * @param height Height of the innerWindow in pixels
     */
    pushResize: {
        value: function(width, height) {
            this.actionStack.push({
                type: "resize",
                target: null,
                width: width,
                height: height,
            });
        }
    },
    
    /**
     * Adds a serialized event to the action stack
     * @param event The event to serialize
     */
    pushEvent: {
        value: function(event) {
            this.actionStack.push(event);
        }
    },
    
    /**
     * Iterates over the action stack, and discards actions that should not contribute to the script
     */
    filterActions: {
        value: function(stack) {
            var filteredStack = [],
                action;
            
            var stackSize = stack.length;
            for(var i = 0; i < stackSize; ++i) {
                action = stack[i];
                
                switch(action.type) {
                    case "keydown":
                        if(!KeyMap[action.arguments.keyCode]) { continue; } // If the key is not in the KeyMap mapping, discard it
                        break;
                    case "drag":
                    case "dragover":
                        action.type = "mousemove"; // This allows us to catch some of the drag and drop mouse events that otherwise get suppressed.
                        break;
                    case "dragend":
                        action.type = "mouseup"; // This allows us to catch some of the drag and drop mouse events that otherwise get suppressed.
                        break;
                }
                filteredStack.push(action); // If nothing else stopped up, add the action
            };
            
            return filteredStack;
        }
    },
    
    /**
     * Iterates over the action stack, finds actions that can be condensed, and condenses them
     */
    condenseActions: {
        value: function(stack) {
            var condensable = ['mousemove', 'textInput']
            var condensedStack = [];
            var action, nextAction;
            
            var stackSize = stack.length;
            for(var i = 0; i < stackSize; ++i) {
                action = stack[i];
                
                if(action.type == "resize" && stack[i+1] && stack[i+1].type == "resize") {
                    continue; // Skip sequences of resizes, only record the last one.
                } 
                
                // Condense a mousedown/mouseup/click sequence into a single action
                // When we see a mouse down, do a look-ahead and see if the mouse up occurs on the same element and if we haven't moved too much
                // If the mouse down/move/up all occur within a certain threshold, collapse it all into a single click;
                if(action.type === "mousedown") { 
                    var clickIndex = this._canCondenseToClick(action, stack, i);
                    if(clickIndex != -1) {
                        i = clickIndex;
                        action.type = "click";
                        condensedStack.push(action);
                        continue;
                    }
                    action.target = null;
                }
                if(action.type === "mouseup") {
                    action.target = null;
                }
                
                if(condensable.indexOf(action.type) != -1) {
                    var condensableSet = [action];
                    var type = action.type;
                    var target = action.target;
                        
                    while(i < stackSize-1) {
                        action = stack[i+1];
                        
                        if((action.type == "mousemove" && type == "mousemove") || (action.type == type && action.target == target)) {
                            condensableSet.push(action);
                            ++i;
                            continue;
                        }
                        break;
                    }
                    
                    if(condensableSet.length > 1) {
                        // Push the condensed action
                        condensedStack.push(this._condenseEventSet(condensableSet, type, target));
                        continue; // Skips the normal push
                    }
                }
                
                condensedStack.push(action);
            };
            
            return condensedStack;
        }
    },
    
    /**
     * Condenses a set of actions that have already been identified as condensible into a single action
     */
    _condenseEventSet: {
        value: function(events, type, target) {
            var event = { target: target };
            
            switch(type) {
                case "mousemove": {
                    event.type = "mouseMoves";
                    event.target = null;
                    
                    var points = [];
                    
                    for(var i in events) {
                        var moveEvent = events[i];
                        points.push({x: moveEvent.arguments.pageX, y: moveEvent.arguments.pageY, timeStamp: moveEvent.timeStamp});
                    }
                    
                    points = this._reducePoints(points, 5);
                    
                    // Calculate the durations of the reduced moves
                    var lastTimestamp = -1;
                    for(var i in points) {
                        var point = points[i];
                        
                        var duration = lastTimestamp == -1 ? 0 : point.timeStamp - lastTimestamp;
                        lastTimestamp = point.timeStamp;
                        
                        delete point["timeStamp"];
                        point.duration = duration;
                    }
                    
                    event.arguments = points;
                } break;
                
                case "textInput": {
                    event.type = "sendKeys";
                    
                    var keyString = "";
                    
                    for(var i in events) {
                        var keyEvent = events[i];
                        keyString += keyEvent.arguments.data;
                    }
                    
                    event.arguments = keyString;
                } break;
            }
            
            return event;
        }
    },
    
    /**
     * Checks to see if a mousedown event can be condensed with the following events into a single "click"
     * @returns -1 if the events cannot condense, or the new stack position if they can.
     */
    _canCondenseToClick: {
        value: function(event, stack, i) {
            var initialX = event.arguments.pageX,
                initialY = event.arguments.pageY,
                nextEvent, deltaX, deltaY, dist;

            while(++i) {
                if(i == stack.length) { return -1; } // Ran out of event stack before finding the mouse up (this is probably an error)
                nextEvent = stack[i];
                if(nextEvent.type !== "mouseup" && nextEvent.type !== "mousemove") { return -1; } // Not condensible, something happens in between that we need to record
                if(nextEvent.target !== event.target) { return -1; } // Clicks don't span elements
                
                deltaX = nextEvent.arguments.pageX - initialX;
                deltaY = nextEvent.arguments.pageY - initialY;
                dist = deltaX * deltaX + deltaY * deltaY; // No need to Sqrt, we'll compare against a premultiplied value
                if(dist > 25) { return -1; } // 5 pixels should be enough for anyone!
                
                if(nextEvent.type === "mouseup") { break; } // We found a mouse up in range. It's a click!
            }
            
            return i;
        }
    },
    
    /**
     * Compile the current action stack into a runnable script
     * @returns Script string
     */
    compile: {
        value: function() {
            var stack = this.filterActions(this.actionStack);
                stack = this.condenseActions(stack);
            var stackSize = stack.length;

            if(stackSize == 0) { return ""; }

            var source = [];
            if (this.options.enhanceCodeReadibility) {
                source.push("// ==== Start Recorded Script, " + new Date().toString() + "==== \r\n");
            }
            source.push("var agent = new Agent();\r\n");
            var prevAction = null, nextAction, action;

            // TODO: Calculate delays
            for(var i = 0; i < stackSize; ++i) {
                action = stack[i];
                nextAction = (i < stackSize-1) ? stack[i+1] : null;

                switch(action.type) {
                    case "navigate":
                        source.push("agent.gotoUrl(\"" + action.url + "\");\r\n");
                        break;
                    case "resize":
                        source.push("agent.setWindowSize(" + action.width + ", " + action.height + ");\r\n");
                        break;
                    default:
                        source.push(this._dispatchEventSource(action, prevAction, nextAction));
                        break;
                }
                prevAction = action;
            }

            if (this.options.enhanceCodeReadibility) {
                source.push("\r\n// ==== End Recorded Script ====\r\n");
            }

            return source.join("\r\n");
        }
    },
    
    /*
    * Calculates the perpendicular distance of a point to a line segment
    */
    _pointToSegmentDistance: {
        value: function(point, segStart, segEnd) {
            var px = (segEnd.x-segStart.x);
            var py = (segEnd.y-segStart.y);

            var lenSqr = (px*px) + (py*py);

            var u = ((point.x-segStart.x)*px + (point.y-segStart.y)*py) / lenSqr;

            // clamp u to [0,1]
            u = u > 1 ? 1 : (u < 0 ? 0 : u);

            var dx = (segStart.x + u * px) - point.x;
            var dy = (segStart.y + u * py) - point.y;

            return Math.sqrt((dx*dx) + (dy*dy));
        }
    },
    
    /**
    * Uses the Ramer–Douglas–Peucker algorithm to reduce the numbers of points in the set of positions given
    * http://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm
    * @param points Array of positions
    * @param epsilon Maximum distance that a point can be from the reduced path and still be excluded
    * @returns a reduced list of points
    */
    _reducePoints: {
        value: function(points, epsilon) {
            var dist, maxDist = 0;
            var index = 0;
            
            var numPoint = points.length;
            for(var i = 1; i < numPoint; ++i) {
                dist = this._pointToSegmentDistance(points[i], points[0], points[numPoint-1]);
                if(dist > maxDist) {
                    index = i;
                    maxDist = dist;
                }
            }

            var reducedPoints;
            if(maxDist >= epsilon) {
                var pointsA, pointsB;
                // Call recursively using the point with the maximum displacement as the start/end of two new segments
                pointsA = this._reducePoints(points.slice(0, index+1), epsilon);
                pointsB = this._reducePoints(points.slice(index), epsilon);
                reducedPoints = pointsA.concat(pointsB.slice(1));
            } else {
                reducedPoints = [points[0], points[numPoint-1]];
            }

            return reducedPoints;
        }
    },
    
    _translateMouseButton: {
        value: function(which) {
            switch(which) {
                case 2: return "Mouse.RIGHT"; // Right
                case 3: return "Mouse.MIDDLE"; // Middle
                default: return "Mouse.LEFT"; // Left
            }
        }
    },
    
    _dispatchEventSource: {
        value: function(event, prevEvent, nextEvent) {
            var source = "";
            var waitTolerance = 250; // How long a delay must be before it's recorded
            var eventTable = {
                click: "click",
                mousedown: "mouseDown",
                mousemove: "mouseMove",
                mouseup: "mouseUp",
                mousemoves: "mouseMove",
                keypress: "sendKeys",
                sendkeys: "sendKeys",
                textinput: "sendKeys",
                focus: "focus"
            };

            // Test to see if the next or previous actions are chained to this one.
            var prevIsChained = prevEvent && prevEvent.target && prevEvent.target == event.target;
            var nextIsChained = nextEvent && nextEvent.target && nextEvent.target == event.target;

            if(prevEvent) {
                var delay = event.timeStamp - prevEvent.timeStamp;
                if(delay >= waitTolerance) {
                    source += "agent.wait(" + delay + ");\r\n\r\n";
                    prevIsChained = false;
                }
            }

            if(nextEvent) {
                var delay = nextEvent.timeStamp - event.timeStamp;
                if(delay >= waitTolerance) {
                    nextIsChained = false;
                }
            }

            if(!prevIsChained) {
                source += "agent";
                if(event.target) { 
                    source += ".element(\"" + event.target + "\")"; 
                }
                if(nextIsChained) {
                    source += "\r\n";
                }
            }

            if(nextIsChained || prevIsChained) {
                source += "    "; // Coding style is spaces, so indent with spaces :).
            }

            funcArgs = [];
            var eventArgs = JSON.stringify(event.arguments);
            eventArgs = eventArgs=='{}' ? '' : eventArgs;
            var typeKey = event.type.toLowerCase();
            
            switch(typeKey) {
                case "scroll":
                    source += ".setScroll";
                    funcArgs.push(event.arguments.scrollLeft, event.arguments.scrollTop);
                    break;
                
                case "keydown":
                    source += ".sendKeys";
                    funcArgs.push("Key." + KeyMap[event.arguments.keyCode]);
                    break;
                
                case "keypress":
                    source += ".sendKeys";
                    funcArgs.push("\"" + String.fromCharCode(event.arguments.which) + "\"");
                    break;
                    
                case "textinput":
                    source += ".sendKeys";
                    funcArgs.push("\"" + event.arguments.data + "\"");
                    break;
                    
                case "mousemove":
                    source += ".mouseMove";
                    funcArgs.push(event.arguments.pageX, event.arguments.pageY);
                    break;
                
                case "mousedown":
                case "mouseup":
                    source += "." + eventTable[typeKey];
                    funcArgs.push(event.arguments.pageX, event.arguments.pageY);
                    break;
                    
                case "click":
                    source += ".click";
                    funcArgs.push(this._translateMouseButton(event.arguments.which), event.arguments.elementX, event.arguments.elementY);
                    break;
                
                case "dblclick":
                    source += ".doubleClick";
                    funcArgs.push(this._translateMouseButton(event.arguments.which), event.arguments.elementX, event.arguments.elementY);
                    break;
                    
                default:
                    if (eventTable[typeKey]){ // If there are direct methods on the agent.element() object, use them.
                        source += "." + eventTable[typeKey];
                        if (eventArgs) funcArgs.push(eventArgs);
                    }
                    break;
            }
            source += "(" + funcArgs.join(",") + ")";

            if(!nextIsChained) {
                source += ";";
            }

            return source;
        }
    },
});
