var agent = new Agent();
//
// Examples
//

//
// Example 1
// =========
//
// Open google.com type in a search term and verify if the
// title of the page is updated and contains the search term.
//
agent.gotoUrl("http://google.com");

var searchField = agent.element("#lst-ib");

// Search for "javascript" in google
searchField.mouseClick().sendKeys("javascript");

//*[@name='btnG']
var formSubmitButton = agent.element("//*[@name='btnG']");

formSubmitButton.click(); // Submit it.
agent.wait(1000); // See the search result, thats just for us humans :)

// Let's read the title of the page, this is the title that
// you also see as the title in the tab of your browser,
// normally for searches (after the form was submitted) this
// changes to something like '<searchterm> - Google search'.
// Let's just find out if the searchterm is contained.

assertContains('javascript',agent.getTitle());
agent.wait(2000); // Just so we can see the result too.
agent.close();





//
// Example 2
// =========
//
// Open google.com type in a search term, verify multiple things:
// 1) is the title of the page updated and contains the search term`?
// 2) after clicking the "clear search button" is the search field empty?
//
agent.gotoUrl("http://google.com");
var searchField = agent.element("#lst-ib");


searchField.mouseClick().sendKeys("javascript");
var formSubmitButton = agent.element("//*[@name='btnG']");

formSubmitButton.click(); // Submit it.
agent.wait(1000); // See the search result, thats just for us humans :)
// The same as described in the example above.
agent.getTitle()
assertContains('javascript',agent.getTitle()); // Should contain "javascript" since we searched for it.
// Let's clear the search field and check that the value is really empty.

var searchlength = searchField.getText().length;

for (i = 0; i < searchlength; ++i)
  {
  searchField.sendKeys(Key.BACKSPACE);  
  }
assertEqual('',searchField.getText());

formSubmitButton.click();
assertNotContains('javascript1',agent.getTitle());

agent.wait(2000);
agent.close();




//*/