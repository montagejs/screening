var agent = new Agent();
agent.gotoUrl("http://www.wdyl.com");
var searchField = agent.element("#indexForm input[name='q']");
var submitButton = agent.element("#indexForm input[type='submit']");

assertEqual('', searchField.getText());
// Search for "javascript"
searchField.sendKeys('javascript');
assertEqual('javascript', searchField.getText());
submitButton.click();

agent.wait(10000); // Let it render.

// Scroll down the rendered page using the scroller on the left.
var scroller = agent.element("#scrBg");
console.log(agent.getScroll());

scroller.mouseDown();
scroller.mouseMove([{"x":0,"y":1,"duration":0},{"x":0,"y":2,"duration":18},{"x":0,"y":3,"duration":18},{"x":0,"y":4,"duration":18},{"x":0,"y":5,"duration":18},{"x":0,"y":6,"duration":18},{"x":0,"y":7,"duration":18},{"x":0,"y":8,"duration":18},{"x":0,"y":9,"duration":18},{"x":0,"y":10,"duration":18},{"x":0,"y":11,"duration":18},{"x":0,"y":12,"duration":18},{"x":0,"y":13,"duration":18},{"x":0,"y":14,"duration":18},{"x":0,"y":15,"duration":18},{"x":0,"y":16,"duration":18},{"x":0,"y":17,"duration":18},{"x":0,"y":18,"duration":18},{"x":0,"y":19,"duration":18},{"x":0,"y":20,"duration":18}]);

//scroller.mouseMove({clientY: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]});
scroller.mouseUp();

// TODO we need a custom compare function, to check that scroll offset is i.e. > 100
assertNotEqual([0, 0], agent.getScroll());

// We are done.
agent.wait(3000);
agent.close();
