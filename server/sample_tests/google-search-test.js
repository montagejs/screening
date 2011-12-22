var agent = new Agent();
agent.gotoUrl("http://google.com");
var searchField = agent.element("#lst-ib");
var formSubmitButton = agent.element("#tsf input[type=submit]");
var clearSearchButton = agent.element('#xbtn, td.gsib_b');

searchField.mouseClick().sendKeys("javascript"); // Focus and type 'javascript'.
assertEqual('javascript', searchField.getText()); // Test the value to be 'javascript'.
formSubmitButton.click(); // Finds the form of this input field and submits it.
//agent.wait(1000); // Wait a little, the title (we check for below) doesn't get updated right away.
assertContains('javascript', agent.getTitle(), "should contain 'javascript'"); // Should contain "javascript" since we searched for it.

//agent.getSource();
clearSearchButton.click();
assertEqual('', searchField.getText())
searchField.sendKeys('uxebu');
//agent.wait(1000); // We need to give it some time to show the results, actually imho we should do that somehow in a smarter way.

// Verify that we have received 10 test results.
assertEqual(10, agent.elements('#ires li.g').getCount(), "the amount of google search results"); // doing a string comparison atm

agent.wait(2000);
agent.close();

//*/
