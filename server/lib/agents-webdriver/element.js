/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
/**
	@module screening/element
 */   
var Q = require("q"),
    when = Q.when,
    by = require("../webdriver/util").By,
    css2xpath = require("../webdriver/css2xpath"),
    resultFilter = require('./util').resultFilter,
    Warning = require('../testcase/warning').Warning;
/**
 * @class module:screening/element.WebdriverElement
 * @classdesc This class provides all methods that can be executed on a selected element.<br>
 * Normally it is returned by browser.element() in order to allow passing references<br>
 * around, see the examples (and tests) below.
 * @example:
 *  >>> // Verify that the returned value really is an instance of Element.
 *  >>> var el = browser.element('WHATEVER');
 *  el instanceof Element
 * 
 *  >>> // Verify that the parameter passed to element() is provided in Element._selector
 *  >>> var el = browser.element('WHATEVER1');
 *  el._selector == 'WHATEVER1'
*/
var WebdriverElement = exports.WebdriverElement = function(agent, element){
    this.agent = agent;
    this.element = element;
    this.session = (agent ? agent.session : null);
    this.sync = (agent ? agent.sync : null);
    this.result = (agent ? agent.result : null);
};

/**
 * Dispatch an event.
 * @function module:screening/element.WebdriverElement#dispatchEvent
 * @param {String} evtName The event to be fired, such as "mousedown", "click", etc.
 * @param {Object} params The parameters that will be set for the event, like "clientX", "keyIdentifier", etc.
 */
WebdriverElement.prototype.dispatchEvent = Warning.deprecateApi(function(evtName, params){
    // I have no idea how this used to work! There doesn't seem to be any code that supports it...
    //throw new Error("API not yet implemented");
    return this;
}, "dispatchEvent");

/**
 * Return the value specified element attribute.
 * @function module:screening/element.WebdriverElement#getAttribute
 * @param {String} attrName The attribute name to query.
 * @return {String} The attribute value.
 */
WebdriverElement.prototype.getAttribute = function(attrName){
    var self = this;
    return this.sync.promise(function() {
        return self.element.getAttribute(attrName);
    }, resultFilter);
};

/**
 * Return the HTML content of the selected element.
 * @function module:screening/element.WebdriverElement#getInnerHtml
 * @return {String} The raw HTML content.
 */
WebdriverElement.prototype.getInnerHtml = function(){
    return this.getAttribute("innerHTML");
};

/**
 * Return the text content of the selected element.
 * @function module:screening/element.WebdriverElement#getInnerText
 * @return {String} The raw text content.
 */
WebdriverElement.prototype.getInnerText = function(){
    var self = this;
    return this.sync.promise(function() {
        return self.element.getInnerText();
    }, resultFilter);
};

/**
 * Tests to see if the value of an attribute on this element is equal to the given value.
 * @function module:screening/element.WebdriverElement#hasAttributeValue
 * @param {Array} attrib Attribute to test.
 * @param {Array} expectedValue Value to test against.
 * @return {Boolean} True is the attribute value is equal to expectedValue.
 */
WebdriverElement.prototype.hasAttributeValue = Warning.deprecateApi(function(attrib, expectedValue){
    var self = this;
    return this.sync.promise(function() {
        return when(self.element.getAttribute(attrib), function(ret){
            return ret.value === expectedValue;
        });
    });
}, "hasAttributeValue");

/**
 * The execution of this function will fail after either the given timeout<br>
 * or the "timeout" option.
 * @function module:screening/element.WebdriverElement#waitForAttributeValue
 * @param {String} attributeName The attribute name that we expect to have a certain value.
 * @param {String} expectedAttributeValue The attribute value we wait for.
 * @param {Integer} maxTimeout The max time in milliseconds to wait for the value to be as expected.
 * @return {Element} A reference to this, to allow chaining.
 */
WebdriverElement.prototype.waitForAttributeValue = function(attributeName, expectedAttributeValue, maxTimeout){
    var self = this;
    return this.sync.promise(function() {
        var waitTimeout = self.agent.scriptObject.getOption("timeout");
        var startTime = Date.now(); // Take the time when this command started, since the element selection does an implicit wait, we subtract the time it took later.
        maxTimeout = maxTimeout || self.agent.scriptObject.getOption("timeout");

        var defer = Q.defer();

        var testValue = function(){
            when(self.element.getAttribute(attributeName), function(ret){
                var timeLeft = maxTimeout - (Date.now() - startTime);
                
                if(ret.value === expectedAttributeValue) {
                    defer.resolve();
                } else {
                    if(timeLeft <= 0) {
                        defer.reject("Attribute did not change to the expected value within the given time limit");
                    } else {
                        setTimeout(testValue, waitTimeout);
                    }
                }
            });
        };
        testValue();

        return defer.promise;
    },
    function() { return self; } // Allow Chaining
    );
};

/**
 * Wait for the given attribute of the current element to change to a different value<br>
 * than the initial one. Right after this function is called the current attribute value<br>
 * is read and this function waits for the attribute's vaue to change.<br>
 * The execution of this function will fail after either the given timeout<br>
 * or the "timeout" option.
 * @function module:screening/element.WebdriverElement#waitForAttributeChange
 * @param {String} attributeName The attribute name that we expect to have a certain value.
 * @param {String} expectedAttributeValue The attribute value we wait for.
 * @param {Integer} maxTimeout The max time in milliseconds to wait for the value to be as expected.
 */
WebdriverElement.prototype.waitForAttributeChange = function(attributeName, maxTimeout){
    var self = this;
    return this.sync.promise(function() {
        var waitTimeout = self.agent.scriptObject.getOption("timeout");
        var startTime = Date.now(); // Take the time when this command started, since the element selection does an implicit wait, we subtract the time it took later.
        maxTimeout = maxTimeout || self.agent.scriptObject.getOption("timeout");

        var defer = Q.defer();
        
        when(self.element.getAttribute(attributeName), function(ret){
            var originalValue = ret.value; // Cache the original value so we can detect when it changes
            
            var testValue = function(){
                when(self.element.getAttribute(attributeName), function(ret){
                    var timeLeft = maxTimeout - (Date.now() - startTime);
                
                    if(ret.value !== originalValue) {
                        defer.resolve();
                    } else {
                        if(timeLeft <= 0) {
                            defer.reject("Attribute did not change within the given time limit");
                        } else {
                            setTimeout(testValue, waitTimeout);
                        }
                    }
                });
            };
            setTimeout(testValue, waitTimeout);
        });

        return defer.promise;
    },
    function() { return self; } // Allow Chaining
    );
};

/**
 * Get the scroll offset of the current element, this only applies to scrollable elements.
 * @function module:screening/element.WebdriverElement#getScroll
 * @returns {Array} Returns an array of the x and y scroll offset of the current element, like so [100, 0].
 */
WebdriverElement.prototype.getScroll = function(){
    return this.agent.executeScript("return [arguments[0].scrollLeft, arguments[0].scrollTop];", [this.element]);
};

/**
 * Scroll the current element to the given position, this only works to scrollable elements.
 * @function module:screening/element.WebdriverElement#setScroll
 * @param {Integer} x The offset to scroll by the x position.
 * @param {Integer} y The offset to scroll by the y position.
 * @return {Element} A reference to this, to allow chaining.
 */
WebdriverElement.prototype.setScroll = function(x, y){
    var self = this;
    return this.agent.executeScript("arguments[0].scrollLeft = arguments[1]; arguments[0].scrollTop = arguments[2];", [this.element, x, y],
    function() { return self; } // Allow Chaining
    );
};
// Old API compatibility, remove soon
WebdriverElement.prototype.setScrollTo = WebdriverElement.prototype.setScroll;

/**
 * Set the scroll offset of the current element; this only works to scrollable elements.
 * @function module:screening/element.WebdriverElement#setScrollBy
 * @param {Integer} x The offset to scroll by the x position.
 * @param {Integer} y The offset to scroll by the y position.
 * @return {Element} A reference to this, to allow chaining.
 */
WebdriverElement.prototype.setScrollBy = Warning.deprecateApi(function(x, y){
    var self = this;
    return this.agent.executeScript("arguments[0].scrollLeft += arguments[1]; arguments[0].scrollTop += arguments[2];", [this.element, x, y],
    function() { return self; } // Allow Chaining
    );
}, "setScrollBy");

/**
 * Set the scroll offset of the current element; this only works to scrollable elements.
 * @function module:screening/element.WebdriverElement#setAttribute
 * @param {String} attrName Element attribute to change.
 * @param {String} attrValue Value to change the attribute to.
 * @return {Element} A reference to this, to allow chaining.
 */
WebdriverElement.prototype.setAttribute = function(attrName, attrValue){
    var self = this;
    return this.agent.executeScript("arguments[0].setAttribute(arguments[1], arguments[2]);", [this.element, attrName, attrValue],
    function() { return self; } // Allow Chaining
    );
};

/**
 * Gets the text content of the element. If the element is an input, returns<br>
 * the input value, otherwise returns the innerText of the element.
 * @function module:screening/element.WebdriverElement#getText
 * @return {String} The text of the element.
 */
WebdriverElement.prototype.getText = function(){
    var self = this;
    return this.sync.promise(function() {
        return when(self.element.getTagName(), function(tagName){
            if(tagName.value == 'input' || tagName.value == 'textarea') {
                return self.element.getValue();
            } else {
                return self.element.getInnerText();
            }
        });
    }, resultFilter);
};

/**
 * Gets the computed style of the given style property for this element.
 * @function module:screening/element.WebdriverElement#getComputedStyle
 * @param {String} styleProp Element style property to evaluate.
 * @return {String} The computed style value.
 */
WebdriverElement.prototype.getComputedStyle = function(styleProp){
    var self = this;
    return this.sync.promise(function() {
        return self.element.style(styleProp);
    }, resultFilter);
};

/**
 * Gets wether or not the element is visible.
 * @function module:screening/element.WebdriverElement#isVisible 
 * @return {Boolean} True if the element is visible.
 */
WebdriverElement.prototype.isVisible = function(){
    var self = this;
    return this.sync.promise(function() {
        return self.element.displayed();
    }, resultFilter);
};

/**
 * Gets wether or not the element is enabled.
 * @function module:screening/element.WebdriverElement#isEnabled
 * @return {Boolean} True if the element is enabled.
 */
WebdriverElement.prototype.isEnabled = function(){
    var self = this;
    return this.sync.promise(function() {
        return self.element.enabled();
    }, resultFilter);
};

/**
 * Gets wether or not the element currently has keyboard focus.
 * @function module:screening/element.WebdriverElement#isFocused
 * @return {Boolean} True if the element has keyboard focus.
 */
WebdriverElement.prototype.isFocused = function(){
    var self = this;
    return this.sync.promise(function() {
        return when(self.session.getActiveElement(), function(el){
            return el.equals(self.element);
        });
    }, resultFilter);
};

/**
 * Gets the checked state of checkbox elements.
 * @function module:screening/element.WebdriverElement#getChecked
 * @return {Boolean} True if the element's "checked" attribute is true.
 */
WebdriverElement.prototype.getChecked = function() {
    return !!this.getAttribute("checked"); // Force to boolean
};

/**
 * Description TODO - Do you want this to appear in the JSDoc rendering?????
 * @function module:screening/element.WebdriverElement#isChecked
 */
WebdriverElement.prototype.isChecked = Warning.deprecateApi(WebdriverElement.prototype.getChecked, "isChecked", "Please use getChecked instead.");

/**
 * Give focus to this element if it accepts focus.
 * @function module:screening/element.WebdriverElement#focus
 * @return {Element} A reference to this, to allow chaining.
 */
WebdriverElement.prototype.focus = function(){
    var self = this;
    return this.agent.executeScript("arguments[0].focus();", [this.element],
    function() { return self; } // Allow Chaining
    );
};

/**
 * Press down the left mouse button at the given coordinate.
 * @function module:screening/element.WebdriverElement#mouseDown
 * @param {Number} x X coordinate relative to the element's left side
 * @param {Number} y Y coordinate relative to the element's top
 * @return {Element} A reference to this, to allow chaining.
 */
WebdriverElement.prototype.mouseDown = function(x, y){
    if(x && typeof x !== "number") { 
        throw Error("Invalid argument. Function only accepts a numeric X and Y coordinate.");
    }
    
    var self = this;
    return this.sync.promise(function() {
        return when(self.session.moveTo(self.element, x, y), function(){
            return self.session.buttonDown();
        });
    },
    function() { return self; }
    );
};
// Old API compatibility, remove soon
WebdriverElement.prototype.mousedown = Warning.deprecateApi(WebdriverElement.prototype.mouseDown, "mousedown", "Please use mouseDown instead");

/**
 * Release the left mouse button at the given coordinate.
 * @function module:screening/element.WebdriverElement#mouseUp 
 * @param {Number} x X coordinate relative to the element's left side.
 * @param {Number} y Y coordinate relative to the element's top.
 * @return {Element} A reference to this, to allow chaining.
 */
WebdriverElement.prototype.mouseUp = function(x, y){
    if(x && typeof x !== "number") { 
        throw Error("Invalid argument. Function only accepts a numeric X and Y coordinate.");
    }
    
    var self = this;
    return this.sync.promise(function() {
        return when(self.session.moveTo(self.element, x, y), function(){
            return self.session.buttonUp();
        });
    },
    function() { return self; }
    );
};
// Old API compatibility, remove soon
WebdriverElement.prototype.mouseup = Warning.deprecateApi(WebdriverElement.prototype.mouseUp, "mouseup", "Please use mouseUp instead.");

/**
 * Perform a mouse move or series of mouse moves.
 * @function module:screening/element.WebdriverElement#mouseMove
 * @param {Number or Array} x X coordinate or An array of points to move the moust between.
 * @param {Number} y Y coordinate.
 * @return {Element} A reference to this, to allow chaining.
 */
WebdriverElement.prototype.mouseMove = function(x, y){
    var self = this;
    if(!x.length) {
        if(x && typeof x !== "number") { 
            throw Error("Invalid argument. Function only accepts a numeric X and Y coordinates or an array of coordinates");
        }
        return this.sync.promise(function() {
            return self.session.moveTo(self.element, x, y);
        },
        function() { return self; } // Allow Chaining
        );
    } else {
        // If the first argument is an array, treat this as a series of mouse moves
        var points = x;
        return this.sync.promise(function() {
            var defer = Q.defer();
            var startTime = Date.now();
            var pointId = 0;

            // Loop through all the points
            // TODO: Time-based interpolation?
            function nextMove() {
                var point = points[pointId];
                when(self.session.moveTo(self.element, point.x, point.y), function() {
                    pointId++;
                    // End of list? Exit
                    if(pointId >= points.length) {
                        defer.resolve(self);
                        return;
                    }
                    var nextPoint = points[pointId];
                    setTimeout(nextMove, nextPoint.duration); //TODO: Timing is going to be off on this, can we improve it?
                });
            }
            nextMove();

            return defer.promise;
        });
    }
};
// Old API compatibility, remove soon
WebdriverElement.prototype.mousemove = Warning.deprecateApi(WebdriverElement.prototype.mouseMove, "mousemove", "Please use mouseMove instead.");
WebdriverElement.prototype.mouseMoves = Warning.deprecateApi(WebdriverElement.prototype.mouseMove, "mouseMoves", "Please use mouseMove instead.");

/**
 * Perform a click on the element.
 * @function module:screening/element.WebdriverElement#click
 * @param {Number} button Optional Mouse button.
 * @param {Number} x Optional X coordinate.
 * @param {Number} y Optional Y coordinate.
 * @return {Element} A reference to this, to allow chaining.
 */
WebdriverElement.prototype.click = function(button, x, y){
    var self = this;
    return this.sync.promise(function() {
        if(x != undefined || y != undefined) {
            return when(self.session.moveTo(self.element, x, y), function(){
                return self.session.click(button);
            });
        } else if(button) {
            // TODO: Get button center point
            return when(self.session.moveTo(self.element, 5, 5), function(){
                return self.session.click(button);
            });
        } else {
            return self.element.click(); // Left click at button center
        }
    },
    function() { return self; } // Allow Chaining
    );
};
/**
 * Alias for "click".
 * @function module:screening/element.WebdriverElement#mouseClick
 */
WebdriverElement.prototype.mouseClick = WebdriverElement.prototype.click;

/**
 * Perform a double left-click on the element.
 * @function module:screening/element.WebdriverElement#doubleClick
 * @param {Number} x Optional X coordinate.
 * @param {Number} y Optional Y coordinate.
 * @return {Element} A reference to this, to allow chaining.
 */
WebdriverElement.prototype.doubleClick = function(x, y){
    var self = this;
    return this.sync.promise(function() {
        if(x != undefined || y != undefined) {
            return when(self.session.moveTo(self.element, x, y), function(){
                return self.session.doubleClick();
            });
        } else {
            // TODO: Get button center point
            return when(self.session.moveTo(self.element, 5, 5), function(){
                return self.session.doubleClick();
            });
        }
    },
    function() { return self; } // Allow Chaining
    );
};

/**
 * These are multiple key strokes executes after one another;<br>
 * the keys to press can be given as a string, e.g.,<br>
 *   <code>browser.execute('#search').sendKeys('uxebu');</code>
 * @function module:screening/element.WebdriverElement#sendKeys
 * @param {String} inputString The input string.
 * @return {Element} A reference to this, to allow chaining.
 */
WebdriverElement.prototype.sendKeys = function(inputString){
    if(typeof inputString !== "string") { 
        throw Error("Invalid argument. Function only accepts a string.");
    }
    
    var self = this;
    return this.sync.promise(function() {
        return self.element.setValue(inputString);
    },
    function() { return self; } // Allow Chaining
    );
};
// Old API compatibility, remove soon
WebdriverElement.prototype.keypress = Warning.deprecateApi(WebdriverElement.prototype.sendKeys, "keypress", "Please use sendKeys instead.");
WebdriverElement.prototype.keyPress = Warning.deprecateApi(WebdriverElement.prototype.sendKeys, "keyPress", "Please use sendKeys instead.");
WebdriverElement.prototype.keyPresses = Warning.deprecateApi(WebdriverElement.prototype.sendKeys, "keyPresses", "Please use sendKeys instead.");

/**
 * Press a single finger to the screen at the given coordinates.
 * @function module:screening/element.WebdriverElement#touchStart
 * @param {Number} x X coordinate relative to the element's left side.
 * @param {Number} y Y coordinate relative to the element's top.
 * @return {Element} A reference to this, to allow chaining.
 */
WebdriverElement.prototype.touchStart = function(x, y){
    var self = this;
    return this.sync.promise(function() {
       return self.session.touchDown(x, y);
    },
    function() { return self; } // Allow Chaining
    );
};
// Old API compatibility, remove soon
WebdriverElement.prototype.touchstart = Warning.deprecateApi(WebdriverElement.prototype.touchStart, "touchstart", "Please use touchStart instead.");

/**
 * Remove a single finger from the screen at the given coordinates.
 * @function module:screening/element.WebdriverElement#touchEnd
 * @param {Number} x X coordinate relative to the element's left side.
 * @param {Number} y Y coordinate relative to the element's top.
 * @return {Element} A reference to this, to allow chaining.
 */
WebdriverElement.prototype.touchEnd = function(x, y){
    var self = this;
    return this.sync.promise(function() {
       return self.session.touchUp(x, y);
    },
    function() { return self; } // Allow Chaining
    );
};
// Old API compatibility, remove soon
WebdriverElement.prototype.touchend = Warning.deprecateApi(WebdriverElement.prototype.touchEnd, "touchend", "Please use touchEnd instead.");

/**
 * Move a single, depressed finger to the given coordinates.
 * @function module:screening/element.WebdriverElement#touchMove
 * @param {Number} x X coordinate relative to the element's left side.
 * @param {Number} y Y coordinate relative to the element's top.
 * @return {Element} A reference to this, to allow chaining.
 */
WebdriverElement.prototype.touchMove = function(x, y){
    var self = this;
    return this.sync.promise(function() {
       return self.session.touchMove(x, y);
    },
    function() { return self; } // Allow Chaining
    );
};
// Old API compatibility, remove soon
WebdriverElement.prototype.touchmove = Warning.deprecateApi(WebdriverElement.prototype.touchMove, "touchmove", "Please use touchMove instead.");

/**
 * Tap the element with a single finger.
 * @function module:screening/element.WebdriverElement#touchClick
 * @return {Element} A reference to this, to allow chaining.
 */
WebdriverElement.prototype.touchClick = function(){
    var self = this;
    return this.sync.promise(function() {
       return self.session.touchClick(self.element);
    },
    function() { return self; } // Allow Chaining
    );
};

/**
 * Tap the element twice with a single finger.
 * @function module:screening/element.WebdriverElement#touchDoubleClick
 * @return {Element} A reference to this, to allow chaining.
 */
WebdriverElement.prototype.touchDoubleClick = function(){
    var self = this;
    return this.sync.promise(function() {
       return self.session.touchDoubleClick(self.element);
    },
    function() { return self; } // Allow Chaining
    );
};

/**
 * Long press the element with a single finger.
 * @function module:screening/element.WebdriverElement#touchLongClick
 * @return {Element} A reference to this, to allow chaining.
 */
WebdriverElement.prototype.touchLongClick = function(){
    var self = this;
    return this.sync.promise(function() {
       return self.session.touchLongClick(self.element);
    },
    function() { return self; } // Allow Chaining
    );
};

// KeyUp/Down is a deprecated API, stubbed in here only to prevent failures on old scripts.
WebdriverElement.prototype.keyDown = Warning.deprecateApi(function(keys){
    // We really don't have a concept of an arbitrary "key down", so just ignore for now.
    return this;
}, "keyDown", "Please use sendKeys instead.");
// Old API compatibility, remove soon
WebdriverElement.prototype.keydown = Warning.deprecateApi(WebdriverElement.prototype.keyDown, "keydown", "Please use sendKeys instead.");
WebdriverElement.prototype.keyUp = Warning.deprecateApi(function(keys){
    // We really don't have a concept of an arbitrary "key up", so just ignore for now.
    return this;
}, "keyUp", "Please use sendKeys instead.");
// Old API compatibility, remove soon.
WebdriverElement.prototype.keyup = Warning.deprecateApi(WebdriverElement.prototype.keyUp, "keyup", "Please use sendKeys instead.");

//-------------------------------------------------------------------------
//=========================================================================
//-------------------------------------------------------------------------

/**
 * @class module:screening/element.WebdriverElementArray
 * @classdesc This is just an extension of Element, and we can add methods if we need to.
 */
var WebdriverElementArray = exports.WebdriverElementArray = function(agent, elements){
    this.agent = agent;
    this.sync = agent ? agent.sync : null;
    this.result = (agent ? agent.result : null);
    for(var i in elements) {
        var element = elements[i];
        this.push(new WebdriverElement(agent, element));
    }
};

/**
 * Description TODO
 * @function module:screening/element.WebdriverElementArray#prototype
*/
WebdriverElementArray.prototype = new Array();

/**
 * Get the number of nodes that have been selected by <code>agent.elements()</code>.<br>
 * To be used i.e. like this:<br>
 *   <code>agent.elements('.className').getCount();</code><br>
 * All return values on <code>elements()</code> return an <code>array</code>, so in assert you need to<br>
 * compare to an <code>array</code>.
 * @function module:screening/element.WebdriverElementArray#getCount
 * @returns {Integer} The number of elements/nodes found.
 */
WebdriverElementArray.prototype.getCount = Warning.deprecateApi(function(){
    return this.length
}, "getCount", "Please use the length proprty instead.");

/**
 * Retrieves the element at the given index.
 * @function module:screening/element.WebdriverElementArray#getItem
 * @param {Integer} index Index to retrieve.
 * @returns {Element} Element at the given index.
 */
WebdriverElementArray.prototype.getItem = Warning.deprecateApi(function(index){
    return this[index];
}, "getItem", "Please use the array index operator, [], instead.");
