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
