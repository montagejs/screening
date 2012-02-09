// Set this to something lower, so the test executes faster.
script.setOption("timeout", 500);

var agent = new Agent();
agent.gotoUrl("/webapps/screening/public/sample/sample.html");

var textField = agent.element("/html/body/form/div/input");
var span = agent.element("span");

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
textField.waitForAttributeValue("class", "montage-textfield");
assertEqual("montage-textfield", textField.getAttribute("class"));

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

