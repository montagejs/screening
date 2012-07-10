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
script.setOption("exitOnFailure", false);

var agent = new Agent();
agent.gotoUrl("/screening/samples/sample.html");
//
// Testing script.setOption()
//

// Does setting and getting that option work at all?
var oldSyncMode = script.getOption("sync.mode"); // Store old sync mode, so we can restore it later.
script.setOption("sync.mode", "auto");
assertEqual("auto", script.getOption("sync.mode"));
// Test it with another option too, to make sure that not only "auto" works :).
script.setOption("sync.mode", "none");
assertEqual("none", script.getOption("sync.mode"));
// Restore old sync mode.
script.setOption("sync.mode", oldSyncMode);


//
// "global.timeout"
//
script.setOption("timeout", 8000);
// This option will effect for how long it will be tried to find an element.

agent.element("/html/body/form/div/input").getText();

//
// script.require()
//
// The following shows how to require a simple script and explicitly get the function "simpleTests"
var simpleTests = script.require("_test-required-script.js").simpleTests;
// Call the function from the required script.
simpleTests();

// Require the script and get a handle on all exported functions.
var requiredScript = script.require("_test-required-script.js");
//console.log(requiredScript);
// Call a function like so:
requiredScript.simpleTests();

requiredScript.funcWithParameters(agent);




//
// "global.exitOnFailure"
//
script.setOption("exitOnFailure", false);
assertTrue(false, "This is allowed to fail, since we are checking the 'exitOnFailure' option here to not stop script execution!");

script.setOption("exitOnFailure", true);
assertTrue(false, "This should make the test script stop, since we set 'exitOnFailure' to true.");
assertTrue(true, "This should not show up in the results page, since the test should have stopped before.");
