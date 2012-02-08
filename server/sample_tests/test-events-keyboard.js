script.setOption("sync.mode", "none");

var agent = new Agent();
agent.gotoUrl("/screening/control-room/ui-sample.html");

var inputNode = agent.element("/html/body/div/input");


inputNode.sendKeys("a");
assertEqual("a", inputNode.getText());

inputNode.sendKeys("b");
assertEqual("ab", inputNode.getText());

inputNode.sendKeys("c");
assertEqual("abc", inputNode.getText());

inputNode.sendKeys(Key.BACKSPACE);
assertEqual("ab", inputNode.getText());

inputNode.sendKeys("cd");
assertEqual("abcd", inputNode.getText());

inputNode.sendKeys("e");
assertEqual("abcde", inputNode.getText());

inputNode.sendKeys("f");
inputNode.sendKeys(Key.DELETE);
assertEqual("abcdef", inputNode.getText());

inputNode.sendKeys("ghijkl");
assertEqual("abcdefghijkl", inputNode.getText());

