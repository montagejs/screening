   
// ==== Start Recorded Script, Mon Oct 10 2011 13:39:06 GMT-0700 (PDT)==== 

var agent = new Agent();

agent.gotoUrl("/webapps/screening/public/sample/sample.html");

agent.setWindowSize(1254, 852);



agent.element("/html/body/form/div/input").sendKeys("h");
agent.wait(288);

agent.element("/html/body/form/div/input").sendKeys("e");
agent.wait(625);

agent.element("/html/body/form/div/input").sendKeys("llo ");
agent.wait(656);

agent.element("/html/body/form/div/input").sendKeys("world");
agent.wait(544);

agent.element("/html/body/form/div/input").sendKeys(Key.SHIFT + "1");
agent.wait(201);

assertEqual("hello world!",agent.element("/html/body/form/div/input").getText());


agent.setWindowSize(927, 976);

agent.mouseMove([{"duration":0},{"x":305,"y":163,"duration":5634}]);
agent.mouseDown(305,163);
agent.mouseMove([{"x":306,"y":163,"duration":0},{"x":415,"y":173,"duration":5989}]);
agent.mouseUp(415,173);
agent.mouseMove([{"x":418,"y":174,"duration":0},{"x":493,"y":187,"duration":84},{"x":575,"y":189,"duration":49},{"x":617,"y":181,"duration":101},{"x":636,"y":161,"duration":416}]);
assertContains("39.28571",agent.element("/HTML/BODY/FORM/DIV[2]/INPUT").getText());
agent.wait(745);


assertEqual("false",agent.element("/HTML/BODY/FORM/DIV[3]/INPUT").getText());

agent.mouseMove([{"x":635,"y":162,"duration":0},{"x":584,"y":183,"duration":132},{"x":521,"y":195,"duration":51},{"x":413,"y":205,"duration":83},{"x":354,"y":195,"duration":217},{"x":305,"y":199,"duration":117},{"x":321,"y":208,"duration":1051}]);
agent.mouseDown(321,208);
agent.mouseMove([{"x":322,"y":208,"duration":0},{"x":365,"y":208,"duration":716}]);
agent.mouseUp(365,208);
agent.mouseMove([{"x":366,"y":209,"duration":0},{"x":410,"y":209,"duration":834}]);
assertEqual("true",agent.element("/HTML/BODY/FORM/DIV[3]/INPUT").getText());

// ==== End Recorded Script ====
