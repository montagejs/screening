script.setOption("sync.mode", "none");

var agent = new Agent();
agent.gotoUrl("/screening/control-room/ui-sample.html");

var inputNode = agent.element("/html/body/div/input");
var checkboxNode = agent.element("/html/body/div[3]/span/input");


//var inputNode = agent.element("#testInput");
//var checkboxNode = agent.element("#testCheckbox");
var scrollArea = agent.element(".scrollTest");

//isFocused
agent.wait(2000); // Give user time to focus!
inputNode.focus()
assertTrue(inputNode.isFocused());

//setAttribute
inputNode.setAttribute("style", "color:red");

// getComputedStyle
assertEqual(inputNode.getComputedStyle("color"), "rgb(255, 0, 0)");

// getAttribute
assertEqual(inputNode.getAttribute("type"), "text");

// getAttribute
var type = inputNode.getAttribute("type");
assertTrue(type == "text");
assertFalse(type == "NONSENSE");


// getText
inputNode.sendKeys("call me back");
assertEqual("call me back", inputNode.getText());

// getInnerHTML
assertEqual("UI Control Sample", agent.element("h1").getInnerHtml());

// getInnerText
assertEqual("UI Control Sample", agent.element("h1").getInnerText());

// isVisible
assertTrue(inputNode.isVisible());

// isEnabled
assertTrue(inputNode.isEnabled());

// isChecked
assertFalse(checkboxNode.getChecked());
checkboxNode.click();
assertTrue(checkboxNode.getChecked());

// doesExist
assertTrue(agent.doesElementExist("/html/body/div[3]/span/input"));
assertFalse(agent.doesElementExist("selectNoneExistingElement"));

//dispatchEvent
//getScroll
assertEqual(scrollArea.getScroll(), [0,0]);

// setScroll
scrollArea.setScroll(0,2);
assertEqual(scrollArea.getScroll(), [0,2]);

// setScroll 
scrollArea.setScroll(0,6);
assertEqual(scrollArea.getScroll(), [0,6]);

//*/