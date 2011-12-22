script.setOption("exitOnFailure", false);
script.setOption("sync.mode", "auto");
script.setOption("sync.noChangeTimeout", 100); // Wait max. 100ms to see that the page is done.
script.setOption("sync.maxWaitTimeout", 1000); // If continuous changes happen wait max. 1sec.

// ==== Start Recorded Script, Thu Jul 28 2011 15:46:55 GMT-0700 (PDT)==== 
var agent = new Agent();
agent.gotoUrl("/webapps/calculator/index.html");
agent.wait(500); // Wait for calculator to load. TODO figure this out, without a wait.

var bigNumber = agent.element("#currentEntry");
var smallNumbers = agent.element("#led");
var result = agent.element("#ledRes");

agent.element("/html/body/div/div/div/div[2]/div/div[2]/div/div/span").click();
//agent.element("//*[@id='calculator-placeholder-_1']").click();
assertEqual("1", bigNumber.getText());

agent.element("/html/body/div/div/div/div[2]/div/div[2]/div[2]/div/span")
//agent.element("//*[@id='calculator-placeholder-_2']")
  .mouseDown()
  .mouseUp();
assertEqual("12", bigNumber.getText());

agent.element("/html/body/div/div/div/div[2]/div/div[2]/div[3]/div/span").click();
//agent.element("//*[@id='calculator-placeholder-_3']/SPAN").click();
assertEqual("123", bigNumber.getText());

agent.element("/html/body/div/div/div/div[2]/div/div[3]/div[4]/div")
//agent.element("//*[@id='calculator-placeholder-_plus']")
  .mouseDown()
  .mouseUp();
assertEqual("123", bigNumber.getText());
assertEqual("123 +", smallNumbers.getText());

agent.element("/html/body/div/div/div/div[2]/div/div[3]/div[3]/div/span").click();
//agent.element("//*[@id='calculator-placeholder-_6']/SPAN").click();
assertEqual("6", bigNumber.getText());
assertEqual("123 + 6", smallNumbers.getText());
assertEqual(" = 129", result.getText());

agent.element("/html/body/div/div/div/div[2]/div/div[3]/div[2]/div/span")
//agent.element("//*[@id='calculator-placeholder-_5']/SPAN")
  .mouseDown()
  .mouseUp();
assertEqual("65", bigNumber.getText());
assertEqual("123 + 65", smallNumbers.getText());
assertEqual(" = 188", result.getText());

agent.element("/html/body/div/div/div/div[2]/div/div[3]/div/div/span").click();
//agent.element("//*[@id='calculator-placeholder-_4']").click();
assertEqual("654", bigNumber.getText());
assertEqual("123 + 654", smallNumbers.getText());
assertEqual(" = 777", result.getText());

agent.element("/html/body/div/div/div/div[2]/div/div[5]/div[4]/div").click();
//agent.element("//*[@id='calculator-placeholder-_equal']").click();

// ==== End Recorded Script ====
//*/