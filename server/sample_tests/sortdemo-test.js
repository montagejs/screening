var agent = new Agent();
//agent.gotoUrl('http://uxebu/sort-demo/');
agent.gotoUrl("http://static.uxebu.com/~cain/sort-demo/");
// Use an XPath expression to find the search field.
var search = agent.element("//*[@id='search']");

agent.setScroll(100, 200);

assertEqual(agent.getScroll(),[0, 200]);

agent.setScroll(0, 180); agent.wait(100);
agent.setScroll(0, 160); agent.wait(100);
agent.setScroll(0, 120); agent.wait(100);
agent.setScroll(0, 80); agent.wait(100);
agent.setScroll(0, 40); agent.wait(100);
agent.setScroll(0, 0); agent.wait(100);

agent.wait(2000); // Give the user to focus the page, so the focus can work.
search.mouseClick().focus();
assertTrue(search.isFocused());
assertEmpty(search.getText());
  
var attr = search.getAttribute('type');
assertNotEmpty(attr);
assertEqual(attr,'search');

search.sendKeys('doc');

assertEqual(search.getText(),'doc');
assertContains('do',search.getText());
assertNotContains(search.getText(),'XXX');
  

// The shortcuts on the top of the page should have an orange bg color.
var shortcutA = agent.element("#shortcuts li");

assertEqual(shortcutA.getComputedStyle('background-color'),'rgb(255, 165, 0)');


// The list is filtered and the first result item should NOT be visible,
// verify that.
var firstItem = agent.element("#objectList li");
assertFalse(firstItem.isVisible());

// Check that the headline's innerHTML contains "javascript".
var headline = agent.element("h1");

var attr1 = headline.getAttribute('innerHTML');
var text = headline.getText();
var innerHtml = headline.getInnerHtml();
var innerText = headline.getInnerText();

assertNotEmpty(attr1);
assertContains('JavaScript',attr1);
assertContains('Objects',attr1);

assertNotEmpty(text);
assertContains('JavaScript',text);
assertContains('JavaScript', text);
assertContains('Objects',text);

assertNotEmpty(innerHtml);
assertContains('JavaScript',innerHtml);
assertContains('Objects',innerHtml);

assertNotEmpty(innerText);
assertContains('JavaScript',innerText);
assertContains('Objects',innerText);


// Are 7 results shown?
assertEqual(agent.elements('#objectList li mark').length,7)

// Is the second result's content 'Doc'?

assertEqual('Doc',agent.elements('#objectList li mark')[1].getInnerHtml());
  
agent.wait(2000);
agent.close();