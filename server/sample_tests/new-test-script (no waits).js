// Script compiled from recording on Fri Jul 22 2011 14:35:24 GMT-0700 (PDT)

var agent = new Agent();
agent.gotoUrl("/screening/control-room/ui-sample.html");

script.setOption("exitOnFailure", false);
script.setOption("synch.mode", "auto");


agent.element("//*[@id='testInput']")
  .focus()
  .click();

var el = agent.element("//*[@id='testInput']")
    .sendKeys("t")
    .sendKeys("e")
    .sendKeys("s")
    .sendKeys("t");
assertEqual('test', el.getAttribute('value'));

var el = agent.element("//*[@id='testInput']")
    .sendKeys(" ")
    .sendKeys("t")
    .sendKeys("e")
    .sendKeys("s")
    .sendKeys("t");   
assertEqual('test test', el.getAttribute('value'));

agent.element("//*[@id='testSlider']/DIV/DIV[12]/DIV")
  .mouseDown(0,0)
  .mouseMove(37,171)
  .mouseMove(38,171)
  .mouseMove(38,173)
  .mouseMove(39,173)
  .mouseMove(41,173)
  .mouseMove(43,174)
  .mouseMove(44,174)
  .mouseMove(45,174)
  .mouseMove(47,176)
  .mouseMove(49,176)
  .mouseMove(51,176)
  .mouseMove(52,177)
  .mouseMove(53,177)
  .mouseMove(54,177)
  .mouseMove(56,179)
  .mouseMove(59,179)
  .mouseMove(63,180)
  .mouseMove(64,180)
  .mouseMove(67,180)
  .mouseMove(71,180)
  .mouseMove(73,181)
  .mouseMove(75,181)
  .mouseMove(81,181)
  .mouseMove(83,181)
  .mouseMove(88,181)
  .mouseMove(93,181)
  .mouseMove(99,181)
  .mouseMove(102,181)
  .mouseMove(104,181)
  .mouseMove(106,181)
  .mouseMove(109,181)
  .mouseMove(111,181)
  .mouseMove(115,181)
  .mouseMove(118,181)
  .mouseMove(120,180)
  .mouseMove(122,180)
  .mouseMove(124,180)
  .mouseMove(128,179)
  .mouseMove(131,179)
  .mouseMove(132,179)
  .mouseMove(137,178)
  .mouseMove(139,178)
  .mouseMove(141,178)
  .mouseMove(143,178)
  .mouseMove(146,178)
  .mouseMove(148,178)
  .mouseMove(152,177)
  .mouseMove(157,177)
  .mouseMove(158,177)
  .mouseMove(162,177)
  .mouseMove(165,177)
  .mouseMove(171,177)
  .mouseMove(175,177)
  .mouseMove(178,177)
  .mouseMove(183,177)
  .mouseMove(189,177)
  .mouseMove(193,177)
  .mouseMove(200,177)
  .mouseMove(208,177)
  .mouseMove(520,172)
  .mouseMove(521,172);

agent.element("//*[@id='testSlider']/DIV/DIV[12]/DIV")
  .mouseMove(521,171)
  .mouseMove(522,166)
  .mouseMove(522,162)
  .mouseMove(523,149);
agent.element("/HTML/BODY/DIV[3]")
  .mouseMove(523,140)
  .mouseMove(523,133);
agent.element("/HTML/BODY/DIV[2]")
  .mouseMove(523,123)
  .mouseMove(523,114)
  .mouseMove(523,110)
  .mouseMove(522,104);
agent.element("/HTML/BODY/DIV[1]")
  .mouseMove(521,101)
  .mouseMove(518,98)
  .mouseMove(517,97)
  .mouseMove(513,96)
  .mouseMove(508,96)
  .mouseMove(500,96)
  .mouseMove(492,98);
agent.element("/HTML/BODY/DIV[2]")
  .mouseMove(463,102)
  .mouseMove(158,114)
  .mouseMove(156,114)
  .mouseMove(151,114)
  .mouseMove(147,114)
  .mouseUp(147,114);

agent
    .mouseMove([{"x":37,"y":158,"duration":0},{"x":33,"y":240,"duration":570},{"x":19,"y":260,"duration":348}])
    .mouseDown(19,260)
    .mouseMove([{"x":20,"y":260,"duration":0},{"x":57,"y":262,"duration":483}])
    .mouseUp(57,262);
agent.element("//*[@id='testToggle']/DIV/DIV/DIV/DIV[4]").click();

agent
    .mouseDown(57,262)
    .mouseMove([{"x":56,"y":262,"duration":0},{"x":17,"y":263,"duration":385}])
    .mouseUp(17,263);
agent.element("//*[@id='testToggle']/DIV/DIV/DIV/DIV[4]").click();
agent.mouseMove([{"x":18,"y":264,"duration":0},{"x":78,"y":271,"duration":250},{"x":113,"y":237,"duration":83},{"x":152,"y":122,"duration":67},{"x":157,"y":31,"duration":67},{"x":150,"y":5,"duration":33},{"x":174,"y":65,"duration":284},{"x":195,"y":90,"duration":33},{"x":261,"y":139,"duration":67},{"x":323,"y":162,"duration":50},{"x":554,"y":170,"duration":67},{"x":686,"y":159,"duration":33},{"x":887,"y":127,"duration":33}]);


agent.element("//*[@id='testCheckbox']").click();


agent.element("//*[@id='testInput']")
  .mouseMove(125,82)
  .mouseMove(109,94)
  .mouseDown(109,94)
  .mouseUp(109,94)
  .click(0,109,94);

var el = agent.element("//*[@id='testInput']")
    .sendKeys(Key.BACKSPACE)
    .sendKeys(Key.BACKSPACE)
    .sendKeys(Key.BACKSPACE)
    .sendKeys(Key.BACKSPACE);    
assertEqual('test ', el.getAttribute('value'));

var el = agent.element("//*[@id='testInput']")
    .sendKeys(Key.BACKSPACE);
assertEqual('test', el.getAttribute('value'));

var el = agent.element("//*[@id='testInput']")
    .sendKeys(Key.BACKSPACE);
assertEqual('tes', el.getAttribute('value'));
	
var el = agent.element("//*[@id='testInput']")
    .sendKeys(Key.BACKSPACE);
assertEqual('te', el.getAttribute('value'));
	
var el = agent.element("//*[@id='testInput']")
    .sendKeys(Key.BACKSPACE);
assertEqual('t', el.getAttribute('value'));
	
var el = agent.element("//*[@id='testInput']")
    .sendKeys(Key.BACKSPACE);
assertEqual('', el.getAttribute('value'));


agent.setScroll(0,123);
assertEqual([0,123], agent.getScroll());


agent.element(".scrollTest")
  	.setScroll(0,100);
assertEqual([0,100], agent.element(".scrollTest").getScroll());


agent.element("//*[@id='testInput']").blur;