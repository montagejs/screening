script.setOption("sync.mode", "none");

var agent = new Agent();
agent.gotoUrl("/screening/control-room/ui-sample.html");

var inputNode = agent.element("/html/body/div/input");
var scrollArea = agent.element(".scrollTest");

inputNode.sendKeys("javascript rox");
if( assertContains("rox", inputNode.getText())){
    agent.setScroll(10, 10);
} else {
    inputNode.setAttribute("style", "color:red");
}

var lastScrollY = -1;
while (lastScrollY < 3000 && lastScrollY!=agent.getScroll()[1]){
    lastScrollY = agent.getScroll()[1];
    agent.setScroll(0, lastScrollY+20);
}
assertGreater(100, agent.getScroll()[1]);

agent.wait(1000);

