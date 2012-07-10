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
// Set this to something lower, so the test executes faster.
script.setOption("timeout", 500);

var agent = new Agent();
agent.gotoUrl("/screening/samples/sample.html");
var textField = agent.element("/html/body/form/div/input");
var span = agent.element("span");
var toggle = agent.element("/html/body/form/div[3]/div");
//
// waitForElement()
//
var el = agent.waitForElement("body");
assertTrue(agent.doesElementExist("body"));

// var el = agent.waitForElement("NoneExistentElement", 2000); // This would ABORT the script, since the element will never be found!!!

// The second parameter can be given, which is the timeout to apply just for this
// call, otherwise the value from setOption("global.timeout") is used.
var el = agent.waitForElement("body", 100);


//
// waitForAttributeValue()
//

toggle.waitForAttributeValue("class", "toggle montage-toggle");
assertEqual("toggle montage-toggle", toggle.getAttribute("class"));


// The color of the SPAN changes every second and iterates over six colors,
// so in 8 seconds we should catch red at least once :).
span.waitForAttributeValue("style", "color: blue; ", 8000); // Let's not wait for the first color (which is red), if the script is really fast it might hit it without any need to wait, prevent that by using "blue" which is the second color :).
assertEqual("color: blue; ", span.getAttribute("style"));

// Wait for a value that will not appear, verify it using assert.
//el.waitForAttributeValue("id", "NOT WHAT WE WANT", 2000); // This would ABORT the test script!!


//
// waitForAttributeChange()
//
span.waitForAttributeChange("style", 1500);
assertNotEqual("nada", span.getAttribute("style"));
span.waitForAttributeChange("style", 1500);
assertNotEqual("nada", span.getAttribute("style"));

// The following attribute doesn't change, so the following will fail.
//el.waitForAttributeChange("class"); // This would ABORT the test script!!!

