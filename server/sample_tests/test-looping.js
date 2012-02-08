script.setOption("sync.mode", "none");

var agent = new Agent();
agent.gotoUrl("/screening/control-room/ui-sample.html");


var inputNode = agent.element("/html/body/div/input");
var scrollArea = agent.element(".scrollTest");

var expected = "0123456789";
// The following will create 10 keypresses, using sequential numbers from 1..10.
// It also checks after every input that the content of "inputNode" is the expected sequence.
for (var i=0, l=10; i<l; i++){
    inputNode.sendKeys(""+i);
    assertEqual(expected.substr(0, i+1), inputNode.getText());
}
// A final test, if the sequence is complete.
assertEqual(expected, inputNode.getText());


// Scroll 10 times, always by 10 pixels.
for (var i=0, l=10; i<l; i++){
    scrollArea.setScroll(0, i*10);
    assertEqual([0, i*10], scrollArea.getScroll());
    // Check that the scroll position is always in the range of (i-1)*10 +/- 2
}
assertEqual([0, 90], scrollArea.getScroll());


