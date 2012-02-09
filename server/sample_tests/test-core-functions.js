script.setOption("sync.mode", "none");

var agent = new Agent();

agent.gotoUrl("/screening/control-room/ui-sample.html");



var inputNode = agent.element("/html/body/div/input");

// getText().
inputNode.sendKeys("ABC");
assertEqual("ABC", inputNode.getText());

// getSource()
var src = null;
assertNotEmpty(agent.getSource());
assertNotContains("Microsoft IE6", agent.getSource());
assertStartsWith("<!-- <copyright>", agent.getSource());
assertEndsWith("</"+"html>", agent.getSource());


// getTitle()
assertEqual("Simple UI Sample", agent.getTitle());
assertNotEqual("Complex", agent.getTitle());

// setScroll()
agent.setScroll(0,2);
assertEqual([0,2], agent.getScroll());

// setScroll()
agent.setScroll(0,4);
assertEqual([0,4], agent.getScroll());

agent.setWindowSize(100, 859);
// setScroll()
agent.setScroll(2,4);
assertEqual([2,4], agent.getScroll());

