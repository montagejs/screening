agent = new Agent();
agent.gotoUrl("/webapps/calculator/index.html");

agent.element("//*[@id='calculator-placeholder-_1']/SPAN")
    .mouseDown()
    .mouseUp();
agent.wait(500);

agent.element("//*[@id='calculator-placeholder-_plus']")
    .mouseDown()
    .mouseUp();
agent.wait(500);

agent.element("//*[@id='calculator-placeholder-_1']/SPAN")
    .mouseDown()
    .mouseUp();


agent.element("//*[@id='calculator-placeholder-_equal']")
    .mouseDown()
    .mouseUp();

agent.wait(1000);

var value = agent.element("#currentEntry").getText();
assertEqual("2", value);