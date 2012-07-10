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
