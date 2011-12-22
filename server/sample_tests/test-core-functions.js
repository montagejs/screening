script.setOption("sync.mode", "none");

var agent = new Agent();

agent.gotoUrl("/screening/control-room/ui-sample.html");


//TODO assertContains("/screening/control-room/ui-sample.html", agent.getUrl());

var inputNode = agent.element("/html/body/div/input");
//var inputNode = agent.element("//*[@id='testInput']");

// getText().
inputNode.sendKeys("ABC");
assertEqual("ABC", inputNode.getText());

// getSource()
var src = null;
assertNotEmpty(agent.getSource());
//agent.getSource().assertContains("ABC"); i dont know yet how to get the current source, not the one loaded.
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

//
// agent.wait()
//
//TODO its not as easy as the script below, becuase of the way we execute the tests .... #thinking
//var before = Date.now();
//agent.wait(500);
//// Has the script waited at least 800ms?
//assertLess(before+400, Date.now(), "Seems the script.wait() didn't work!");
//assertGreater(Date.now(), before);
//
//var before = Date.now();
//agent.wait(2000);
//// Has the script waited at least 800ms?
//assertLess(before+1800, Date.now(), "Seems the script.wait() didn't work!");
//assertGreater(Date.now(), before);

//*/ //Leave this in here, to test that if the last line is a comment the execution works anyways. (regression testing)