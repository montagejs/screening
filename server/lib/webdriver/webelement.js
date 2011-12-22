/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var GET = require("./util").GET;
var POST = require("./util").POST;
var DELETE = require("./util").DELETE;
var mix = require("./util").mix;

var WebElement = exports.WebElement = function(el, session){
    mix (this, el);
    this.rawElement = el;
    this.session = session;
    this.elementUrl = this.session.sessionUrl + "/element/" + this.ELEMENT;
}

WebElement.prototype = {
    toString: function(){
        return "[WebElement " + this.elementUrl+ "]"
    },
    describe: function(){
        return GET({
            url: this.elementUrl
        });
    },
    findElement: function(query){
        var _self=this;
        return POST({
            url: this.elementUrl + "/element",
            body: JSON.stringify(query)
        });
    },
    findElements: function(query){
        return POST({
            url: this.elementUrl + "/elements",
            body: JSON.stringify(query)
        });
    },
    click: function(){
        return POST({
            url: this.elementUrl + "/click"
        });
    },
    submit: function(){
        return POST({
            url: this.elementUrl + "/submit"
        });
    },
    getInnerText: function(){
        return GET({
            url: this.elementUrl + "/text"
        });
    },
    getValue: function(){
        return GET({
            url: this.elementUrl + "/value"
        });
    },
    setValue: function(keys){
        return POST({
            url: this.elementUrl + "/value",
            body: JSON.stringify({value:keys.split("")})
        });
    },
    getTagName: function(){
        return GET({
            url: this.elementUrl + "/name"
        });
    },
    clear: function(){
        return POST({
            url: this.elementUrl + "/clear"
        });
    },
    selected: function(set){
        if (set){
            return POST({
                url: this.elementUrl + "/selected"
            });
        }else{  
            return GET({
                url: this.elementUrl + "/selected"
            });
        }
    },
    toggle: function(){
        return POST({
            url: this.elementUrl + "/toggle"
        });
    },
    
    enabled: function(){
        return GET({
            url: this.elementUrl + "/enabled"
        });
    },
    getAttribute: function(name){
        if (!name){
            throw new Error("No property name supplied to WebElement.getAttribute()");
        }
        return GET({
            url: this.elementUrl + "/attribute/" + name
        });
    },
    equals: function(otherElement){
        return GET({
            url: this.elementUrl + "/equals/"+otherElement.ELEMENT
        });
    },
    displayed: function(){
        return GET({
            url: this.elementUrl + "/displayed"
        });
    },
    "location": function(){
        return GET({
            url: this.elementUrl + "/location"
        });
    },
    
    locationInView : function(){
        return GET({
            url: this.elementUrl + "/location_in_view"
        });
    },
    
    size: function(){
        return GET({
            url: this.elementUrl + "/size"
        });
    },
    
    style: function(prop){
        return GET({
            url: this.elementUrl + "/css/" + prop
        });
    },

    hover: function(){
        return POST({
            url: this.elementUrl + "/hover"
        });
    },
    drag: function(x,y){
        return POST({
            url: this.elementUrl + "/drag",
            body: JSON.stringify({x: x, y: y})
        });
    }
}
