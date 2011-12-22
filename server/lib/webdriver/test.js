/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */

var Session = require("./session").Session;
var by = require('./util').By
var assert = require("assert");
var when = require("q").when;

var browserName = "chrome";
var url = "http://localhost:9515"; 

var session = new Session({url: url});
var capabilities = session.startSession({browserName: browserName});
var url = "http://www.google.com/";

when(capabilities, function(capabilities){
    assert.equal(capabilities.value.browserName, browserName);
    var getUrl = session.get(url);
    return getUrl.then(function(){
        return when(session.getCurrentUrl(), function(currentUrl){
            return when(session.findElements(by.id("lst-ib")), function(el){
                return when(el[0].setValue("hhhh"), function(){
                    return when(session.findElements(by.name("btnG")), function(el){
                        return when(el[0].click(), function(){
                            setTimeout(function(){
                                session.quit();
                            }, 1000);
                        });
                    });
                });
            });
            
        });
    });
});