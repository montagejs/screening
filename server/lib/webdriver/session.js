/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */

var when = require("q").when;

var WebElement = require("./webelement").WebElement;

var GET = require("./util").GET;
var POST = require("./util").POST;
var DELETE = require("./util").DELETE;
var MOUSEBUTTON = require("./util").MOUSEBUTTON;
var mix = require("./util").mix;

var pshallow= require("./util").pshallow;

var Session = exports.Session = function(options){
    this.options = options;
}

Session.prototype = {
    startSession: function(desiredCapabilities){
        var req={
            url: this.options.url + "/session",
            body: JSON.stringify({desiredCapabilities: desiredCapabilities})    
        }

        var _self=this;
        //print("startSession() ");
        //pshallow(req);    
        return when(POST(req), function(results){
            if (results.statusCode=='302' || results.statusCode=='303'){
                var sessionUrl = _self.sessionUrl = (results.headers.location.indexOf("http") == 0) ?
                    results.headers.location : 
                    _self.options.url + results.headers.location;
                return when(GET({url: _self.sessionUrl}),function(response){
                    //print("response handler for start Session: ", typeof response);
                    //pshallow(response);
                    _self.session = response;
                    return response;
                });
            }
            return Error("startSession did not redirect to a new session url");
        });
    },
    get: function(url){
        return POST({
            url: this.sessionUrl + "/url",
            body: JSON.stringify({"url": url})
        });
    },
    executeScript: function(script, args){
        //print("executescript session: ", JSON.stringify(this.session));
        if (!this.session.value.javascriptEnabled){
            console.log("Javascript is not available in the active platform/browser driver");
        }else{
            return POST({
                url: this.sessionUrl + "/execute",
                body: JSON.stringify({'script': script, 'args': args||[]})
            });
        }
    },
    setImplicitWait: function(duration){
        return POST({
            url: this.sessionUrl + "/timeouts/implicit_wait",
            body: JSON.stringify({ms: duration})
        }); 
    },
    findElement: function(query){
        var _this = this;
        return when(POST({
            url: this.sessionUrl + "/element",
            body: JSON.stringify(query)
        }), function(response){
            return new WebElement(response.value, _this);
        });
    },
    findElements: function(query){
        var _this=this;
        return when(POST({
            url: this.sessionUrl + "/elements",
            body: JSON.stringify(query)
        }), function(response){
            return response.value.map(function(el){return new WebElement(el, this)},_this)
        });
    },
    getActiveElement: function(){
        var _this=this;
        return when(POST({
            url: this.sessionUrl + "/element/active"
        }), function(response){
            return new WebElement(response.value, _this);
        });
    },
    getCapabilities: function(){
        return this.session.value;
    },

    getCurrentUrl: function(){
        return GET({
            url: this.sessionUrl + "/url"
        });
    },
    getScreenshot: function(type){
        return GET({
            url: this.sessionUrl + "/screenshot?outputType=" + type
        });
    },
    getSource: function(){
        return GET({
            url: this.sessionUrl + "/source"
        });
    },
    getTitle: function(){
        return GET({
            url: this.sessionUrl + "/title"
        });
    },
    getCookies: function(){
        return GET({
            url: this.sessionUrl + "/cookie"
        });
    },
    getSpeed: function(){
        return GET({
            url: this.sessionUrl + "/speed"
        });
    },
    setSpeed: function(speed){
        return POST({
            url: this.sessionUrl + "/speed",
            body: JSON.stringify({speed: speed})
        });
    },
    getWindowHandle: function(){
        return GET({
            url: this.sessionUrl + "/window_handle"
        });
    },
    getOrientation: function(){
        return GET({
            url: this.sessionUrl + "/orientation"
        });
    },
    getWindowHandles: function(){
        return GET({
            url: this.sessionUrl + "/window_handles"
        });
    
    },
    isJavascriptEnabled: function(){
        return this.session.value.javascriptEnabled;
    },
    manage: function(){
        console.log("NOT IMPLEMENTED:  manage()");
    },
    navigation: {
        back: function(){
            return POST({
                url: this.sessionUrl + '/back'
            }); 
        },
        forward: function(){
            return POST({
                url: this.sessionUrl + '/forward'
            }); 
        },
        refresh: function(){
            return POST({
                url: this.sessionUrl + '/refresh'
            }); 
        }
    },
    quit: function(){
        return DELETE({
            url: this.sessionUrl
        });
    },
    close: function(){
        return DELETE({
            url: this.sessionUrl + "/window"
        });
    },
    deleteCookie: function(cookie){
        return DELETE({
            url: this.sessionUrl + "/cookie/" + cookie
        });
    },
    deleteAllCookies: function(cookie){
        return DELETE({
            url: this.sessionUrl + "/cookie"
        });
    },

    switchToFrame: function(nameOrIdOrIndex){
        return POST({
            url: this.sessionUrl + "/frame",
            body: JSON.stringify({id: nameOrIdOrIndex})
        }); 
    },
    switchToWindow : function(nameOrHandle){
        return POST({
            url: this.sessionUrl + "/window",
            body: JSON.stringify({name: nameOrHandle})
        }); 
    },
    toString: function(){
        return "[RemoteWebDriver Session" + this.sessionUrl + "]"
    },
    click: function(mouseButton){
        // defaults to left-click (see util.MOUSEBUTTONS for possible values)
        return POST({
            url: this.sessionUrl + "/click",
            body: JSON.stringify({button: mouseButton || MOUSEBUTTON.LEFT})
        });
    },
    buttonDown: function(mouseButton){
        // defaults to left-click (see util.MOUSEBUTTONS for possible values)
        return POST({
            url: this.sessionUrl + "/buttondown"
        });
    },
    buttonUp: function(mouseButton){
        // defaults to left-click (see util.MOUSEBUTTONS for possible values)
        return POST({
            url: this.sessionUrl + "/buttonup"
        });
    },
    doubleClick: function(){
        return POST({
            url: this.sessionUrl + "/doubleclick"
        });
    },
    moveTo: function(element, xOffset, yOffset){
        var moveToParams = {};
        if(element && element.ELEMENT){
            moveToParams['element'] = element.ELEMENT;
        }
        moveToParams['xoffset'] = xOffset || 0;
        moveToParams['yoffset'] = yOffset || 0;
        return POST({
            url: this.sessionUrl + "/moveto",
            body: JSON.stringify(moveToParams)
        });
    },
    // TOUCH events
    touchClick: function(element){
        return POST({
            url: this.sessionUrl + "/touch/click",
            body: JSON.stringify({element: element.ELEMENT})
        });
    },
    touchDown: function(x, y){
        return POST({
            url: this.sessionUrl + "/touch/down",
            body: JSON.stringify({x: x, y: y})
        });
    },
    touchUp: function(x, y){
        return POST({
            url: this.sessionUrl + "/touch/up",
            body: JSON.stringify({x: x, y: y})
        });
    },
    touchMove: function(x, y){
        return POST({
            url: this.sessionUrl + "/touch/move",
            body: JSON.stringify({x: x, y: y})
        });
    },
    touchScroll: function(element, xOffset, yOffset){
        return POST({
            url: this.sessionUrl + "/touch/scroll",
            body: JSON.stringify({
                element: element.ELEMENT,
                xOffset: xOffset,
                yOffset: yOffset
            })
        });
    },
    touchDoubleClick: function(element){
        return POST({
            url: this.sessionUrl + "/touch/doubleclick",
            body: JSON.stringify({ element: element.ELEMENT })
        });
    },
    touchLongClick: function(element){
        return POST({
            url: this.sessionUrl + "/touch/longclick",
            body: JSON.stringify({ element: element.ELEMENT })
        });
    },
    touchFlick: function(element, xOffset, yOffset, speed){
        return POST({
            url: this.sessionUrl + "/touch/flick",
            body: JSON.stringify({ 
                element: element.ELEMENT,
                xOffset: xOffset || 0,
                yOffset: yOffset || 0,
                speed: speed || 0
            })
        });
    },
    touchFlickSpeed: function(xSpeed, ySpeed){
        return POST({
            url: this.sessionUrl + "/touch/flick",
            body: JSON.stringify({ 
                xSpeed: xSpeed || 0,
                ySpeed: ySpeed || 0
            })
        });
    },
    keys: function(keys){
        return POST({
            url: this.sessionUrl + "/keys",
            body: JSON.stringify({value:keys.split("")})
        });
    },
    getAlertText: function(){
        return GET({
            url: this.sessionUrl + "/alert_text"
        });
    },
    setPromptText: function(text){
        return POST({
            url: this.sessionUrl + "/alert_text",
            body: JSON.stringify({text:text})
        });
    },
    acceptAlert: function(){
        return POST({
            url: this.sessionUrl + "/accept_alert"
        });
    },
    dismissAlert: function(){
        return POST({
            url: this.sessionUrl + "/dismiss_alert"
        });
    },
}

