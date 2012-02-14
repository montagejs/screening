/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */

var parseUrl = require("url").parse;
var Q = require("q");
var xhr = require("request");

var By = exports.By = { 
    className : function(param){
        return {using: "class name", "value": param}
    },
    cssSelector: function(param){
        return {using: "css selector", "value": param}
    },
    query: function(param){
        return {using: "css selector", "value": param}
    },
    id: function(param){
        return {using: "id", "value": param}
    },
    linkText: function(param){
        return {using: "link text", "value": param}
    },
    name: function(param){
        return {using: "name", "value": param}
    },
    partialLinkText: function(param){
        return {using: "partial link text", "value": param}
    },
    tagName: function(param){
        return {using: "tag name", "value": param}
    },
    xpath: function(param){
        return {using: "xpath", "value": param}
    }
}

var MOUSEBUTTON = exports.MOUSEBUTTON = {
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2
}

var pshallow = exports.pshallow=function(obj){
    for (var i in obj){
        try {
        if (typeof obj[i]=="object" ||typeof obj[i]=="function"){
            console.log("obj[" + i + "]" + typeof obj[i]);
        }else{
            if ((typeof obj[i]=='string')||(obj[i] && obj[i].toString)) {
                console.log("obj[" + typeof obj[i] + "[" + i + "]" + obj[i]);
            }else if (typeof obj[i]=="boolean") { 
                console.log("obj[" + i + "]" + obj[i]);
        
            }else{
                    console.log("*obj[" + i + "]" + typeof obj[i]);
            }
        }
        }catch(e){
            console.log("Error on: " + i);
        }
    }
}

//shallow mixin
var mix = exports.mix = function(){
    var base = arguments[0];
    for (var i=0; i<arguments.length; i++){
        for (var prop in arguments[i]){
            base[prop]=arguments[i][prop];
        }
    }
    return base;
}

//wonder if i should be doing this on my own?
var strip = function strip(str){
    var x=[];
    for(var i in str){
        if (str.charCodeAt(i)){
            x.push(str.charAt(i));
        }
    }
    return x.join('');
}

var responseHandler = function(error, response, body){
    //print("responseHandler() " + response.status + " type: "+ typeof response.status);
    if (response.statusCode >= 300){
        return response;
    }

    if (response && typeof(body) != "undefined"){
        ret = "";
        // selenium-server sometimes return an empty body
        try {
            ret = JSON.parse(strip(body));
        }
        catch (ex) {
        }
        return ret;
    }
}

var GETHeaders={
    accept: "application/json;charset=utf-8",
    "content-type": "application/json;charset=utf-8"
}

var POSTHeaders={
    "accept": "application/json;charset=utf8",
    "content-type": "application/json;charset=utf8"
}
var GET=exports.GET=function(request){
    var req= {
        url: request.url,
        method: "GET",
        headers: mix({},GETHeaders,{host: parseUrl(request.url).host}, request.headers)
    }

    //print("GET " + req.url);
    var defer = Q.defer();
    xhr(req, function(error, response, body){
        if(error){
            defer.reject(error);
        }
        else {
            ret = responseHandler(error, response, body);
            if(ret.statusCode && ret.statusCode >= 400){
                defer.reject("error");
            }
            else {
                defer.resolve(ret);
            }
        }
    });
    return defer.promise;
}

var DELETE=exports.DELETE=function(request){
    var req= {
        url: request.url,
        method: "DELETE",
        headers: mix({},GETHeaders,{host: parseUrl(request.url).host}, request.headers)
    }

    var defer = Q.defer();
    xhr(req, function(error, response, body){
        if(error){
            defer.reject(error);
        }
        else {
            ret = responseHandler(error, response, body);
            if(ret.statusCode && ret.statusCode >= 400){
                defer.reject("error");
            }
            else {
                defer.resolve(ret);
            }
        }
    });
    return defer.promise;
}

/*
This entire method is re-implemented using only node's http client library, there's a problem
with the request library and chromedriver 17+.
Please do not remove. I'll keep this here and keep testing with updated versions of request.
 */
//var POST=exports.POST=function(request){
//    var req= {
//        url: request.url,
//        method: "POST",
//        headers: mix({},POSTHeaders,{host: parseUrl(request.url).host}, request.headers)
//    }
//    //print("POST: " + request.body);
//    //print("type: " + typeof request.body);
//
//    //print("POST " + req.url);
//    if (request.body) {
//        req.body = request.body;
//    }
//    req.headers['Content-Length']=(request.body && request.body.length) ? request.body.length : "0";
//
//    var defer = Q.defer();
//    xhr(req, function(error, response, body){
//        if(error){
//            defer.reject(error);
//        }
//        else {
//            ret = responseHandler(error, response, body);
//            if(ret.statusCode && ret.statusCode >= 400){
//                var retBody = JSON.parse(body);
//                defer.reject(retBody);
//            }
//            else {
//                defer.resolve(ret);
//            }
//        }
//    });
//    return defer.promise;
//}

var POST = exports.POST = function(request) {
    var http = require("http");

    var parsedUrl = parseUrl(request.url);
    var options = {
        host: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + (parsedUrl.search || "") + (parsedUrl.hash || ""),
        method: "POST",
        headers: mix({}, POSTHeaders, {host: parsedUrl.host}, request.headers)
    }

    // Fix the body
    if(typeof(request.body) === "object") {
        request.body = JSON.stringify(request.body);
    }

    options.headers['Content-Length'] = (request.body && request.body.length) ? request.body.length : "0";

    var defer = Q.defer();

    var httpReq = http.request(options, function(res) {
        var fullBody = "";
        res.on('data', function(chunk) {
            fullBody += chunk;
        });
        res.on('end', function(chunk) {
            var ret = responseHandler(null, res, fullBody);

            if (ret.statusCode && ret.statusCode >= 400) {
                var retBody;
                try {
                    retBody = JSON.parse(fullBody);
                } catch(ex) {
                    retBody = "The response contained malformed JSON. Raw output: " + fullBody;
                }
                defer.reject(retBody);
            }
            else {
                defer.resolve(ret);
            }
        });
    });
    httpReq.on("error", function(e) {
        defer.reject(e);
    });

    if (request.body) {
        httpReq.write(request.body, "binary");
    }

    httpReq.end();

    return defer.promise;
}