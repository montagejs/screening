script.setOption("sync.mode", "none");

var agent = new Agent();
agent.gotoUrl("/screening/control-room/ui-sample.html");

var inputNode = agent.element("/html/body/div/input");

var text = inputNode.getText();
assertEmpty(text);
assertEqual("", text);

// The following shows how all the assert functions work.
var text = inputNode.sendKeys("ABC").getText();
assertNotEmpty(text);
assertEqual("ABC", text);
assertNotEqual("XYZ", text);
assertContains("BC", text);
assertStartsWith("AB", text);
assertEndsWith("BC", text);
assertEqual("ABC", text);

assertLess("BCD", text);
assertGreater("AAA", text);
assertGreater("ABB", text);

var h2s = agent.elements("h2");
assertEqual(10, h2s.length);
assertLess(100, h2s.length);
assertGreater(1, h2s.length);
assertBetween([0, 20], h2s.length); // Is the count in between 0 and 20? 
assertBetween([9, 11], h2s.length); // Is the count in between 9 and 11? 
assertPrecision([10, 1], h2s.length); // Is the count between 10-1 and 10+1?
// Use floating numbers.
assertBetween([9.9, 10.1], h2s.length); // 9.9..10.1
assertPrecision([10, 0.1], h2s.length); // 9.9..10.1


var checkbox = agent.element("/html/body/div[3]/span/input");
//var checkbox = agent.element("#testCheckbox");
assertFalse(checkbox.getChecked());
assertTrue(checkbox.click().getChecked());

// Asserts on multiple elements.
var inputNodes = agent.elements("input");

var expected = ["ABC", "on"];
for (i=0;i<inputNodes.length;i++)
{
  assertEqual(expected[i], inputNodes[i].getText());
}

expected = ["text", "checkbox"];

for (i=0;i<inputNodes.length;i++)
{
  assertEqual(expected[i], inputNodes[i].getAttribute("type"));
}


var inputText = [];
for(var i = 0; i < inputNodes.length; ++i) {
 inputText.push(inputNodes[i].getText());
}

assertEqual(["ABC", "on"], inputText);
assertContains("ABC", inputText);
assertNotContains("XYZ", inputText);
//
// Special developer test.
//
// The following tests are meant less for documentation and examples
// they are rather used for functionality testing and verification and
// regression tests, to verify bugs that used to exist.
//

// Adding two different kind of spaces (with char code 32 and 160) and make sure comparing them is unified.
var text = inputNode.sendKeys(" \u00A0").getText();
assertEqual("ABC  ", text);
assertEqual("ABC\u00A0\u00A0", text);
assertEqual("ABC\u00A0 ", text);
assertEqual("ABC \u00A0", text);
//*/