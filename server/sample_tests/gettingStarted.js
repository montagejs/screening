var agent = new Agent();
//
// Examples
//

//
// Example 1
// =========
//
// Open google.com and search for "java".
// the explicit version
//
agent.gotoUrl("http://google.com");
// Focus the search field, click it with the mouse, as a user normally does.
agent.element("#lst-ib").mouseDown();
agent.element("#lst-ib").mouseUp();
agent.element("#lst-ib").click();
// Type "j"
agent.element("#lst-ib").sendKeys("j");
// Type "a"
agent.element("#lst-ib").sendKeys("a");
// Type "v"
agent.element("#lst-ib").sendKeys("v");
// Type "a"
agent.element("#lst-ib").sendKeys("a");

agent.close();



//
// Example 2
// =========
//
// Open google.com and search for "java".
// compact version 2, use references to the nodes
//
agent.gotoUrl("http://google.com");
var searchField = agent.element("#lst-ib");
// Focus the search field, click it with the mouse, as a user normally does.
searchField.mouseDown();
searchField.mouseUp();
searchField.click();
// Type "java"
searchField.sendKeys("j");
searchField.sendKeys("a");
searchField.sendKeys("v");
searchField.sendKeys("a");

agent.close();



//
// Example 3
// =========
//
// Open google.com and search for "java".
// compact version 3, use click() and sendKeys()
//
agent.gotoUrl("http://google.com");
var searchField = agent.element("#lst-ib");
// Focus the search field, click it with the mouse, as a user normally does.
searchField.click();
// Type "java"
searchField.sendKeys("java");

agent.close();



//
// Example 4
// =========
//
// Open google.com and search for "java".
// compact version 4, use chaining
//
agent.gotoUrl("http://google.com");
agent.element("#lst-ib").click().sendKeys("java");
agent.close();
