/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
/**
	@module screening/agent
*/
var Q = require("q"),
    when = Q.when,
    fs = require("fs"),
    by = require("../webdriver/util").By,
    css2xpath = require("../webdriver/css2xpath"),
    Session = require("../webdriver/session.js").Session,
    resultFilter = require('./util').resultFilter,
    WebDriverComponent = require("./component").WebDriverComponent,
    WebdriverElement = require("./element").WebdriverElement,
    WebdriverElementArray = require("./element").WebdriverElementArray,
    Warning = require('../testcase/warning').Warning;
/**
    @class module:screening/agent.WebDriverAgent
*/
var WebDriverAgent = exports.WebDriverAgent = function(session, sync, scriptObject, result){
    this.session = session;
    this.sync = sync;
    this.scriptObject = scriptObject;
    this.result = result;
    this.firstNavigate = true;
    this.rootElement = null;
};

/**
 * Explicitly end the current test case with the given message.
 * @function module:screening/agent.WebDriverAgent#endTest
 * @param {String} message Message to log about why the test was ended.
 */
WebDriverAgent.prototype.endTest = function(message){
    var self = this;
    return this.sync.promise(function() {
        return self.session.close(); // TODO: How is the message passed back to the results?
    }, 
    function() { return self; } // Allow Chaining
    );
};

/**
 * Close the browser.
 * @function module:screening/agent.WebDriverAgent#close
 */
WebDriverAgent.prototype.close = function(){
    var self = this;
    return this.sync.promise(function() {
        // Rather than closing the window, just navigate it to a blank page. 
        // This allows us to open a "new window" during the same session.
        return self.session.get("about:blank");
    });
};

/**
 * Executes a javascript string on the agent.
 * @function module:screening/agent.WebDriverAgent#executeScript
 * @param {String} script The script to execute
 * @param {Array} args Array of arguments to pass to the script
 * @param {Function} resultCallback Optional callback to transform the result of the script before returning
 * @return {Object} Return value of the script evaluated
 */
WebDriverAgent.prototype.executeScript = function(script, args, resultCallback){
    var self = this;
    return this.sync.promise(function() {
        return self.session.executeScript(script, args);
    }, function(ret) {
        if(resultCallback) {
            return resultCallback(ret.value);
        }
        return ret.value;
    });
};

/**
 * @private
 */
WebDriverAgent.prototype.debugger = function(){
    var self = this;
    return this.executeScript("debugger;", [],
    function() { return self; } // Allow Chaining
    );
};

/**
 * Return a reference to ONE node.<br>
 * The return value.<br>
 * @function module:screening/agent.WebDriverAgent#element
 * @param {String} selector The CSS query selector or XPath by which to reach a node.
 * @return {Element} An element 
 * @example
 * var node = agent.element('#nodeId'); // Select a node using it's ID, which triggers a CSS query.
 * var node = agent.element('#nodeId .className'); // Select a node using any kind of CSS query.
 *
 * var node = agent.element('//*[@id='search']'); // Select a node using an XPath query.
*/
WebDriverAgent.prototype.element = function(selector){
    var self = this;
    return this.sync.promise(function() {
        var defer = Q.defer();
        var xpathQuery = self._getXPathQuery(selector);
        var waitTimeout = parseInt(self.scriptObject.getOption("timeout"));
        
        self.session.setImplicitWait(waitTimeout).then(function() {
            self.session.findElement(by.xpath(xpathQuery)).then(function(element) {
                defer.resolve(new WebdriverElement(self, element));
            }, function(err) {
                defer.reject(selector + ": " + err.value.message);
            });
        }, function(err) {
            defer.reject(selector + ": " + err.value.message);
        });
        
        return defer.promise;
    });
};

/**
 * Return a reference to ONE component.
 * @function module:screening/agent.WebDriverAgent#component
 * @param {String} selector The CSS query selector or XPath by which to reach a node.
 * @return {WebDriverComponent} returns the component if found, otherwise null 
 * @example
 * var node = agent.component('#nodeId'); // Select a node using it's ID, which triggers a CSS query.
 * var node = agent.component('#nodeId .className'); // Select a node using any kind of CSS query.
 * 
 * var node = agent.component('//*[@id='search']'); // Select a node using an XPath query.
 */
WebDriverAgent.prototype.component = function(selector){
    var self = this;
    var component = this.sync.promise(function() {
        var defer = Q.defer();
        var xpathQuery = self._getXPathQuery(selector);
        var waitTimeout = parseInt(self.scriptObject.getOption("timeout"));

        self.session.setImplicitWait(waitTimeout).then(function() {
            self.session.findElement(by.xpath(xpathQuery)).then(function(element) {
                var script = "if(arguments[0].controller) {return true;} else {return false;}";
                self.session.executeScript(script, [element.rawElement]).then(function(hasController) {
                    if(hasController.value) {
                        defer.resolve(new WebDriverComponent(self, element));
                    } else {
                        defer.reject(selector + " has no associated component");
                    }
                }, function(err) {
                    defer.reject(selector + ": " + err.value.message);
                });
            }, function(err) {
                defer.reject(selector + ": " + err.value.message);
            });
        }, function(err) {
            defer.reject(selector + ": " + err.value.message);
        });

        return defer.promise;
    });

    // TODO: Enable at your own risk!
    //component._syncPrototype();
    return component;
};

/**
 * Return a chainable instance that refers to a set of elements.
 * @function module:screening/agent.WebDriverAgent#elements
 * @param {String} selector The XPath or CSS selector which is used to find elements, that the reference is returned for.
 * @return {Elements} An instance of Elements to allow chaining various functions on it.
 */
WebDriverAgent.prototype.elements = function(selector){
    var self = this;
    return this.sync.promise(function() {
        var defer = Q.defer();
        var xpathQuery = self._getXPathQuery(selector);
        var waitTimeout = parseInt(self.scriptObject.getOption("timeout"));
        
        self.session.setImplicitWait(waitTimeout).then(function() {
            self.session.findElements(by.xpath(xpathQuery)).then(function(elements) {
                defer.resolve(new WebdriverElementArray(self, elements));
            }, function(err) {
                defer.reject(selector + ": " + err.value.message);
            });
        }, function(err) {
            defer.reject(selector + ": " + err.value.message);
        });
        
        return defer.promise;
    });
};

/**
 * Test if the element defined by the selector does exist.
 * @function module:screening/agent.WebDriverAgent#doesElementExist
 * @returns {Boolean} True if the element exists on the page
 * @example
 * agent.doesElementExist(".className") => true
 */
WebDriverAgent.prototype.doesElementExist = function(selector){
    var self = this;
    return this.sync.promise(function() {
        var defer = Q.defer();
        var xpathQuery = self._getXPathQuery(selector);
        
        self.session.findElement(by.xpath(xpathQuery)).then(function(element) {
            defer.resolve(true);
        }, function(err) {
            defer.resolve(false);
        });
        return defer.promise;
    });
};

/**
 * Wait for the element defined by the selector waiting no longer than timeout.<br>
 * If no timeout is given, the option "timeout" is used.
 * @function module:screening/agent.WebDriverAgent#waitForElement 
 * @param {String} selector Either an XPath expression or CSS selector.
 * @param {Integer} timeout The max time that this function shall wait.
 * @returns {Agent} A reference to this, to allow chaining.
 */
WebDriverAgent.prototype.waitForElement = function(selector, timeout){
    var self = this;
    return this.sync.promise(function() {
        var defer = Q.defer();
        var xpathQuery = self._getXPathQuery(selector);
        var waitTimeout = timeout ? timeout : parseInt(self.scriptObject.getOption("timeout"));
        
        self.session.setImplicitWait(waitTimeout).then(function() {
            self.session.findElement(by.xpath(xpathQuery)).then(function(element) {
                defer.resolve(new WebdriverElement(self, element));
            }, function(err) {
                defer.reject(err);
            });
        });
        
        return defer.promise;
    });
};

/**
 * Navigate the browser to the given URL.
 * @function module:screening/agent.WebDriverAgent#gotoUrl
 * @param {String} url The URL to go to.
 */
WebDriverAgent.prototype.gotoUrl = function(url){
    var self = this;
    // Navigate to the given URL
    this.sync.promise(function() {
        var defer = Q.defer();

        if(url.indexOf("http") != 0) {
            // prefix the url with the request origin if it is just relative
            url = self.scriptObject.getOption("global._requestOrigin") + url;
        }

        // On the initial run of the webdriver execution we open a separate window
        // to allow control of the window size (chrome does not allow resizing a main window)
        if(self.firstNavigate){
            self.firstNavigate = false;
            self.session.executeScript("window.open('" + url + "', 'interactionWindow', 'resizable=yes');").then(function(){
                self.session.switchToWindow("interactionWindow").then(function(){
                    setTimeout(function() {
                        defer.resolve();
                        self._installVisualization();
                    }, self.scriptObject.getOption("loadTimeout"));
                }, defer.reject);
            });
        } else {
            self.session.get(url).then(function(){
                setTimeout(function() {
                    defer.resolve();
                    self._installVisualization();
                }, self.scriptObject.getOption("loadTimeout"));
            }, defer.reject);
        }

        return defer.promise;
    });
    
    
    
    // Query the root element for mouse operations
    this.rootElement = this.sync.promise(function() {
        return self.session.findElement(by.xpath("//html"));
    });

    return self;
};

/**
 * Make the execution wait for the given number of milliseconds.
 * @function module:screening/agent.WebDriverAgent#wait
 * @param {integer} ms The given number of milliseconds to wait
 */
WebDriverAgent.prototype.wait = function(ms){
    var self = this;
    return this.sync.promise(function() {
        var defer = Q.defer();
        setTimeout(function() {
            defer.resolve(self); // Return self to allow chaining
        }, ms ? ms : 0);
        return defer.promise;
    });
};

/**
 * Return the title of the page from the client.
 * @function module:screening/agent.WebDriverAgent#getTitle
 * @returns {String} The title as defined (or modified) in the HTML site.
 */
WebDriverAgent.prototype.getTitle = function(){
    var self = this;
    return this.sync.promise(function() {
        return self.session.getTitle();
    }, resultFilter);
};

/**
 * Return the source code of the page from the client.<br>
 * The source code at the current time is returned, this allows<br>
 * to verify certain DOM content (pieces) if necessary.
 * @function module:screening/agent.WebDriverAgent#getSource
 * @returns {String} The current source code of the site.
 */
WebDriverAgent.prototype.getSource = function(){
    var self = this;
    return this.sync.promise(function() {
        return self.session.getSource();
    }, resultFilter);
};

/**
 * Get the scroll offset of the page.
 * @function module:screening/agent.WebDriverAgent#getScroll
 * @returns {Array} An array of the scroll offset, the array contains x,y, like so: [x, y].
 * @example
 * agent.getScroll() => [100, 2]
 */
WebDriverAgent.prototype.getScroll = function(){
    return this.executeScript("return [window.pageXOffset, window.pageYOffset];");
};

/**
 * Set the scroll offset of the page to a certain position.<br>
 * The page scrolls only as far as possible, so be careful when scrolling to 1000,1000<br>
 * that you don't try to check for exactly that position.
 * @function module:screening/agent.WebDriverAgent#setScroll
 * @param {int} x The x position to scroll to.
 * @param {int} y The y position to scroll to.
 * @returns {Agent} A reference to this, to allow chaining.
 */
WebDriverAgent.prototype.setScroll = function(x, y){
    var self = this;
    return this.executeScript("window.scrollTo(arguments[0], arguments[1]);", [x, y],
    function() { return self; } // Allow Chaining
    );
};
// Old API compatibility, remove soon
WebDriverAgent.prototype.setScrollTo = WebDriverAgent.prototype.setScroll;

/**
 * Scrolls the page by the given offset.<br>
 * If the current scroll is at 1,1 and you scroll down 1,1 it tries to scroll to position 2,2.<br>
 * Note that the page's max scroll position depends on the page's size and the browser<br>
 * window dimensions.
 * @function module:screening/agent.WebDriverAgent#setScrollBy 
 * @param {int} x The x offset by how many pixels to scroll.
 * @param {int} y The y offset by how many pixels to scroll.
 * @returns {Agent} A reference to this, to allow chaining.
 */
WebDriverAgent.prototype.setScrollBy = Warning.deprecateApi(function(x, y){
    var self = this;
    return this.executeScript("window.scrollBy(arguments[0], arguments[1]);", [x, y],
    function() { return self; } // Allow Chaining
    );
}, "setScrollBy");


/**
 * Get the available window inner-size of the browser window.
 * @function module:screening/agent.WebDriverAgent#getWindowSize
 * @returns {Array} An array of the current screen size: [width, height]
 * @example
 * agent.getWindowSize() => [640, 480]
 */
WebDriverAgent.prototype.getWindowSize = function(){
    return this.executeScript("return [window.innerWidth, window.innerHeight];");
};

/**
 * Sizes the visible area of the window to the passed width/height
 * @function module:screening/agent.WebDriverAgent#setWindowSize
 * @param {int} width The width in pixels of the visible area
 * @param {int} height The height in pixels of the visible area
 * @returns {Agent} A reference to this, to allow chaining.
 * @example
 * agent.setWindowSize(width, height)
 */
WebDriverAgent.prototype.setWindowSize = function(width, height){
    var self = this;
    return this.executeScript(
        "window.resizeTo(" +
        "   arguments[0]+window.outerWidth-window.innerWidth," +
        "   arguments[1]+window.outerHeight-window.innerHeight" +
        ");", [width, height],
    function() { return self; } // Allow Chaining
    );
};

/**
 * Press down the left mouse button at the given coordinate.
 * @function module:screening/agent.WebDriverAgent#mouseDown
 * @param {Number} x X coordinate
 * @param {Number} y Y coordinate
 * @return {Agent} A reference to this, to allow chaining.
 */
WebDriverAgent.prototype.mouseDown = function(x, y){
    if(typeof x !== "number") { 
        throw Error("Invalid argument. Function only accepts a numeric X and Y coordinate.");
    }
    var self = this;
    return this.sync.promise(function() {
        return when(self.session.moveTo(self.rootElement, x, y), function(){
            return self.session.buttonDown();
        });
    },
    function() { return self; }
    );
};

/**
 * Release the left mouse button at the given coordinate.
 * @function module:screening/agent.WebDriverAgent#mouseUp 
 * @param {Number} x X coordinate
 * @param {Number} y Y coordinate
 * @return {Agent} A reference to this, to allow chaining.
 */
WebDriverAgent.prototype.mouseUp = function(x, y){
    if(typeof x !== "number") { 
        throw Error("Invalid argument. Function only accepts a numeric X and Y coordinate.");
    }
    var self = this;
    return this.sync.promise(function() {
        return when(self.session.moveTo(self.rootElement, x, y), function(){
            return self.session.buttonUp();
        });
    },
    function() { return self; }
    );
};

/**
 * Perform a mouse move or series of mouse moves
 * @function module:screening/agent.WebDriverAgent#mouseMove 
 * @param {Number or Array} x X coordinate or An array of points to move the moust between
 * @param {Number} y Y coordinate
 * @return {Agent} A reference to this, to allow chaining.
 */
WebDriverAgent.prototype.mouseMove = function(x, y){
    var self = this;
    if(!x.length) {
        if(typeof x !== "number") { 
            throw Error("Invalid argument. Function only accepts a numeric X and Y coordinates or an array of coordinates");
        }
        return this.sync.promise(function() {
            return self.session.moveTo(self.rootElement, x, y);
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
                when(self.session.moveTo(self.rootElement, point.x, point.y), function() {
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

/**
 * Perform a click at the given coordinate.
 * @function module:screening/agent.WebDriverAgent#click
 * @param {Number} button Optional Mouse button
 * @param {Number} x Optional X coordinate
 * @param {Number} y Optional Y coordinate
 * @return {Agent} A reference to this, to allow chaining.
 */
WebDriverAgent.prototype.click = function(button, x, y){
    var self = this;
    return this.sync.promise(function() {
        return when(self.session.moveTo(self.rootElement, x, y), function(){
            return self.session.click(button);
        });
    },
    function() { return self; } // Allow Chaining
    );
};

/**
 * Perform a double left-click at the given coordinate.
 * @function module:screening/agent.WebDriverAgent#doubleClick
 * @param {Number} x Optional X coordinate
 * @param {Number} y Optional Y coordinate
 * @return {Agent} A reference to this, to allow chaining.
 */
WebDriverAgent.prototype.doubleClick = function(x, y){
    var self = this;
    return this.sync.promise(function() {
        return when(self.session.moveTo(self.rootElement, x, y), function(){
            return self.session.doubleClick();
        });
    },
    function() { return self; } // Allow Chaining
    );
};

/**
 * Gets the text of an alert, confirm, or prompt dialog
 * @function module:screening/agent.WebDriverAgent#getAlertText
 * @return {String} Text of the currently displayed model dialog.
 */
WebDriverAgent.prototype.getAlertText = function(){
    var self = this;
    return this.sync.promise(function() {
        return self.session.getAlertText();
    }, resultFilter);
};

/**
 * Sets the input text of a prompt dialog.
 * @function module:screening/agent.WebDriverAgent#setPromptText
 * @param {String} text Text to input into the prompt
 * @return {Agent} A reference to this, to allow chaining.
 */
WebDriverAgent.prototype.setPromptText = function(text){
    var self = this;
    return this.sync.promise(function() {
        return self.session.setPromptText(text);
    },
    function() { return self; } // Allow Chaining
    );
};

/**
 * Clicks the "Ok" button of an alert, confirm, or prompt dialog.
 * @function module:screening/agent.WebDriverAgent#acceptAlert
 * @return {Agent} A reference to this, to allow chaining.
 */
WebDriverAgent.prototype.acceptAlert = function(){
    var self = this;
    return this.sync.promise(function() {
        return self.session.acceptAlert();
    },
    function() { return self; } // Allow Chaining
    );
};

/**
 * Clicks the "Cancel" button of a confirm or prompt dialog.
 * @function module:screening/agent.WebDriverAgent#dismissAlert
 * @return {Agent} A reference to this, to allow chaining.
 */
WebDriverAgent.prototype.dismissAlert = function(){
    var self = this;
    return this.sync.promise(function() {
        return self.session.dismissAlert();
    },
    function() { return self; } // Allow Chaining
    );
};

/**
 * @private
 */
WebDriverAgent.prototype._getXPathQuery = function(selectorString){
    var xpathQuery = selectorString;
    // TODO: this check is not sufficient
    if (xpathQuery.indexOf('/')!=0) {
        // converting css queries to xpath
        xpathQuery = css2xpath(xpathQuery);
    }
    return xpathQuery;
};

/**
 * @private
 */
WebDriverAgent.prototype._installVisualization = function() {
    var self = this;
    // Install the playback visualization layer
    fs.readFile(__dirname + "/visualizer.js", 'utf8', function(err, visScript) {
        if(err) { console.log(err); return; }

        // Inject the recording script into the page
        when(self.session.executeScript(visScript), function() {
            // Success
        }, function(err) {
            console.log("Visualization Script Failed", err.value.message);
        });
    });
};
