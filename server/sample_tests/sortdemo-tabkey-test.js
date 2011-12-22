//
// NOTE: The TAB key doesnt work yet, so some asserts here most definitely will fail!
//
var agent = new Agent();
agent.gotoUrl('http://static.uxebu.com/~cain/sort-demo/');
var searchField = agent.element("//*[@id='search']");
var searchButton = agent.element("button"); // Get the first button, that is the search button
var clearButton = agent.element("#clearSearchButton");

agent.wait(2000); // This wait is necessary so the user can focus the AUT tab of the browser.

searchField.mouseClick().focus();
assertTrue(searchField.isFocused());
searchField.sendKeys("doc");

clearButton.focus();
clearButton.sendKeys(Key.ENTER);

// Watching the events using monitorEvents(document.body) shows that on TAB press
// only keydown and keyup are fired, so we reproduce this here.

// Press TAB
searchField.sendKeys(Key.TAB);  
assertEqual("Search",searchButton.getText());
assertTrue(searchButton.isFocused());

// Press TAB
searchButton.sendKeys(Key.TAB);

// Press ENTER
clearButton.sendKeys(Key.ENTER);

agent.wait(2000);
agent.close();