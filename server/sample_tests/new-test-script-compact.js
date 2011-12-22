// Manually modified test script using the script recorded (Script compiled from recording on Fri Jul 22 2011 14:35:24 GMT-0700 (PDT))
var agent = new Agent();
agent.gotoUrl("/screening/control-room/ui-sample.html");
var inputField = agent.element("//*[@id='testInput']");

inputField
    .click(0,115,95)
    .focus();
agent.wait("408");

inputField
    .sendKeys("test");
assertEqual('test',inputField.getAttribute('value'));
agent.wait("725");

inputField
    .sendKeys(' test');
assertEqual('test test',inputField.getAttribute('value'));
agent.wait("1454");


agent.element("//*[@id='testSlider']/DIV/DIV[12]/DIV")
    .mouseDown(0,0)
    // Define multiple mouse moves to be executed, 
      .mouseMove([{"x":36,"y":0,"duration":0},{"x":50,"y":0,"duration":18},{"x":100,"y":174,"duration":18},{"x":50,"y":0,"duration":18}])
agent.wait("969");

agent.element("//*[@id='testSlider']/DIV/DIV[12]/DIV")
    .mouseMove(523,0);
agent.element("/HTML/BODY/DIV[3]")
    .mouseMove(523,133);
agent.element("/HTML/BODY/DIV[2]")
    .mouseMove(522,104);
agent.element("/HTML/BODY/DIV[1]")
    .mouseMove(480,100);
agent.element("/HTML/BODY/DIV[2]")
    .mouseMove(147,114)
    .mouseUp(147,114);
agent.wait("1033");


agent.element("//*[@id='testCheckbox']").click();
agent
    .mouseMove([{"x":37,"y":158,"duration":0},{"x":33,"y":240,"duration":570},{"x":19,"y":260,"duration":348}])
    .mouseDown(19,260)
    .mouseMove([{"x":20,"y":260,"duration":0},{"x":57,"y":262,"duration":483}])
    .mouseUp(57,262);
agent.element("//*[@id='testToggle']/DIV/DIV/DIV/DIV[4]").click();
agent.wait(463);

agent
    .mouseDown(57,262)
    .mouseMove([{"x":56,"y":262,"duration":0},{"x":17,"y":263,"duration":385}])
    .mouseUp(17,263);
agent.element("//*[@id='testToggle']/DIV/DIV/DIV/DIV[4]").click();
agent.mouseMove([{"x":18,"y":264,"duration":0},{"x":78,"y":271,"duration":250},{"x":113,"y":237,"duration":83},{"x":152,"y":122,"duration":67},{"x":157,"y":31,"duration":67},{"x":150,"y":5,"duration":33},{"x":174,"y":65,"duration":284},{"x":195,"y":90,"duration":33},{"x":261,"y":139,"duration":67},{"x":323,"y":162,"duration":50},{"x":554,"y":170,"duration":67},{"x":686,"y":159,"duration":33},{"x":887,"y":127,"duration":33}]);


// Pressing BACKSPACE.
inputField
  .sendKeys(Key.BACKSPACE)
  .sendKeys(Key.BACKSPACE)
  .sendKeys(Key.BACKSPACE)
  .sendKeys(Key.BACKSPACE);
assertEqual('test ',inputField.getAttribute('value'));
agent.wait("241");


assertEqual('test',inputField.sendKeys(Key.BACKSPACE).getAttribute('value'));
agent.wait("918");

assertEqual('tes',inputField.sendKeys(Key.BACKSPACE).getAttribute('value'));

assertEqual('te',inputField.sendKeys(Key.BACKSPACE).getAttribute('value'));

assertEqual('t',inputField.sendKeys(Key.BACKSPACE).getAttribute('value'));

assertEqual('',inputField.sendKeys(Key.BACKSPACE).getAttribute('value'));
agent.wait("1017");

inputField.blur;