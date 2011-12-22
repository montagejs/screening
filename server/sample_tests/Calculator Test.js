var agent = new Agent();
agent.gotoUrl("/webapps/calculator/index.html");

var bigNumber = agent.element("#currentEntry");
var smallNumbers = agent.element("#led");
var result = agent.element("#ledRes");
  
agent.element("/html/body/div/div/div/div[2]/div/div[2]/div/div/span").click();
//agent.element("#calculator-placeholder-_1").click();
agent.wait(500);

assertEqual("1", bigNumber.getText());

agent.element("/html/body/div/div/div/div[2]/div/div[2]/div[2]/div/span").click();
//agent.element("#calculator-placeholder-_2").click();
agent.wait(500);

assertEqual("12", bigNumber.getText());

agent.element("/html/body/div/div/div/div[2]/div/div[2]/div[3]/div/span").click();
//agent.element("#calculator-placeholder-_3").click();
agent.wait(500);

assertEqual("123", bigNumber.getText());

agent.element("/html/body/div/div/div/div[2]/div/div[3]/div[4]/div").click();
//agent.element("#calculator-placeholder-_plus").click();
agent.wait(500);

assertEqual("123", bigNumber.getText());
assertEqual("123 +", smallNumbers.getText());

agent.element("/html/body/div/div/div/div[2]/div/div[3]/div[3]/div/span").click();
//agent.element("#calculator-placeholder-_6").click();
agent.wait(500);

assertEqual("6", bigNumber.getText());
assertEqual("123 + 6", smallNumbers.getText());
assertEqual(" = 129", result.getText());

agent.element("/html/body/div/div/div/div[2]/div/div[3]/div[2]/div/span").click();
//agent.element("#calculator-placeholder-_5").click();
agent.wait(500);

assertEqual("65", bigNumber.getText());
assertEqual("123 + 65", smallNumbers.getText());
assertEqual(" = 188", result.getText());

agent.element("/html/body/div/div/div/div[2]/div/div[3]/div/div/span").click();
//agent.element("#calculator-placeholder-_4").click();
agent.wait(500);

assertEqual("654", bigNumber.getText());
assertEqual("123 + 654", smallNumbers.getText());
assertEqual(" = 777", result.getText());

agent.element("/html/body/div/div/div/div[2]/div/div[5]/div[4]/div").click();
//agent.element("#calculator-placeholder-_equal").click();
agent.wait(1000);