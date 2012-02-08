script.setOption("sync.mode", "none");

var agent = new Agent();
agent.gotoUrl("/screening/control-room/ui-sample.html");



var nodes = [];

nodes.push(agent.element("/html/body/div/input"));
nodes.push(agent.element("/html/body/div[3]/span/input"));
nodes.push(agent.element(".scrollTest"));


//length
assertEqual(3, nodes.length);

//setAttribute
//getComputedStyle
for (i=0;i<nodes.length;i++)
{
  nodes[i].setAttribute("style", "color:red");
  assertEqual("rgb(255, 0, 0)", nodes[i].getComputedStyle("color"));
}


// getAttribute
expected = ["text", "checkbox", null];

for (i=0;i<nodes.length;i++)
{
  assertEqual(expected[i], nodes[i].getAttribute("type"));
}

// getText
var text = [];
for(i = 0; i < agent.elements("h2").length; ++i) {
 text.push(agent.elements("h2")[i].getText());
}
assertEqual(["Loooong text","Loooong text","Loooong text","Loooong text","Loooong text","Loooong text","Loooong text","Loooong text","Loooong text","Loooong text"], text);

// isVisible
for (i=0;i<nodes.length;i++)
{
  assertEqual(true, nodes[i].isVisible());
}

// isEnabled
for (i=0;i<nodes.length;i++)
{
  assertEqual(true, nodes[i].isEnabled());
}


