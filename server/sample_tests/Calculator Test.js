var agent = new Agent();
agent.gotoUrl("/screening/node_modules/montage-samples/calculator/index.html");
var bigNumber = agent.element("#currentEntry");
var smallNumbers = agent.element("#led");
var result = agent.element("#ledRes");
  
agent.element("/html/body/div/div/div/div[2]/div/div[2]/div/div/span").click(); //click on '1'
agent.wait(500);

assertEqual("1", bigNumber.getText());

agent.element("/html/body/div/div/div/div[2]/div/div[2]/div[2]/div/span").click(); //click on '2'
agent.wait(500);

assertEqual("12", bigNumber.getText());

agent.element("/html/body/div/div/div/div[2]/div/div[2]/div[3]/div/span").click(); //click on '3'
agent.wait(500);

assertEqual("123", bigNumber.getText());

agent.element("/html/body/div/div/div/div[2]/div/div[3]/div[4]/div").click(); //click on '+'
agent.wait(500);

assertEqual("123", bigNumber.getText());
assertEqual("123 +", smallNumbers.getText());

agent.element("/html/body/div/div/div/div[2]/div/div[3]/div[3]/div/span").click(); //click on '6'
agent.wait(500);

assertEqual("6", bigNumber.getText());
assertEqual("123 + 6", smallNumbers.getText());
assertEqual(" = 129", result.getText());

agent.element("/html/body/div/div/div/div[2]/div/div[3]/div[2]/div/span").click(); //click on '5'
agent.wait(500);

assertEqual("65", bigNumber.getText());
assertEqual("123 + 65", smallNumbers.getText());
assertEqual(" = 188", result.getText());

agent.element("/html/body/div/div/div/div[2]/div/div[3]/div/div/span").click(); //click on '4'
agent.wait(500);

assertEqual("654", bigNumber.getText());
assertEqual("123 + 654", smallNumbers.getText());
assertEqual(" = 777", result.getText());

agent.element("/html/body/div/div/div/div[2]/div/div[5]/div[4]/div").click();
agent.wait(1000);