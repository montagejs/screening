script.setOption("exitOnFailure", false);

var agent = new Agent();
agent.gotoUrl("/webapps/screening/public/sample/sample.html");

//
// script.wait() NOT IMPLEMTED YET
//
//var before = +new Date;
//script.wait(1000);
//// Has the script waited at least 800ms?
//assertLess(before+800, +new Date, "Seems the script.wait(1000) didn't work!");


//
// Testing script.setOption()
//

// Does setting and getting that option work at all?
var oldSyncMode = script.getOption("sync.mode"); // Store old sync mode, so we ca restore it later.
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
//agent.element("#textField").getText();

//
// script.require()
//
// The following shows how to require a simple script and explicitly get the function "simpleTests"
var simpleTests = script.require("_test-required-script").simpleTests;
// Call the function from the required script.
simpleTests();

// Require the script and get a handle on all exported functions.
var requiredScript = script.require("_test-required-script");
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