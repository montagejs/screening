var agent = new Agent();

agent.gotoUrl("/screening/node_modules/montage/samples/todo-mvc/index.html");

// Set script properties

script.setOption("exitOnFailure", false);
script.setOption("timeout", 1000);
script.setOption("sync.mode", "auto");



//Verify initial state of the app - no items in the list
agent.setWindowSize(927, 989);

var input = agent.element("/HTML/BODY/DIV/FORM/DIV/LABEL/INPUT");
var itemText = agent.element("/HTML/BODY/DIV/DIV/SPAN");


assertEqual("0 items", itemText.getText()); 

//Add 3 tasks, verify they appear in the list, "Clear Completed" button appears,
//and total count == 3

input.sendKeys("Task1");
input.sendKeys(Key.ENTER);

var btn_Complete = agent.element("/HTML/BODY/DIV/FORM[2]/DIV/INPUT");
var firstCheckBox = agent.element("/HTML/BODY/DIV/UL/LI/DIV/FORM/DIV/LABEL/INPUT");
var firstItem = agent.element("/HTML/BODY/DIV/UL/LI/DIV/FORM/DIV/LABEL/SPAN[2]");

assertEqual("Mark all as complete", btn_Complete.getText()); 
assertTrue (agent.doesElementExist("/HTML/BODY/DIV/UL/LI/DIV/FORM/DIV/LABEL/INPUT"));
assertEqual("Task1", firstItem.getText()); 
assertEqual("1 item", itemText.getText()); 

input.sendKeys("Task2");
input.sendKeys(Key.ENTER);

var secondCheckBox = agent.element("/HTML/BODY/DIV/UL/LI[2]/DIV/FORM/DIV/LABEL/INPUT");
var secondItem = agent.element("/HTML/BODY/DIV/UL/LI[2]/DIV/FORM/DIV/LABEL/SPAN[2]");

input.sendKeys("Task3");
input.sendKeys(Key.ENTER);
 
assertEqual("3 items", itemText.getText()); 


//Mark 2nd Task as completed, verify the task has strike-through, and total count of tasks == 2
secondCheckBox.click();

var btn_Clear = agent.element("/HTML/BODY/DIV/DIV/DIV/DIV/FORM/DIV/INPUT");

assertTrue (agent.doesElementExist("/HTML/BODY/DIV/DIV/DIV/DIV/FORM/DIV/INPUT"));
assertEqual("Clear Completed", btn_Clear.getText()); 

assertEqual("Task2", secondItem.getText()); 
assertEqual("line-through", secondItem.getComputedStyle("text-decoration"));
  
assertEqual("2 items", itemText.getText()); 

//Clear completed task (Task2), verify it's removed from the list
btn_Clear.click();

assertEqual("Task3", secondItem.getText()); 
assertFalse (agent.doesElementExist("//*[@id='clearCompletedForm']/DIV/INPUT"));

//Mark all tasks as "Completed"
//Verify  all check-boxes have check-marks, all tasks are crossed, and tasks count ==0
btn_Complete.click();

assertEqual ("Mark all as incomplete",btn_Complete.getText());
assertTrue(firstCheckBox.getAttribute("aria-checked"));
assertTrue(secondCheckBox.getAttribute("aria-checked"));

assertEqual("Task1", firstItem.getText()); 
assertEqual("line-through", firstItem.getComputedStyle("text-decoration"));
assertEqual("Task3", secondItem.getText()); 
assertEqual("line-through", secondItem.getComputedStyle("text-decoration"));

assertEqual("0 items", itemText.getText()); 
assertTrue (agent.doesElementExist("/HTML/BODY/DIV/DIV/DIV/DIV/FORM/DIV/INPUT"));
//Uncheck check-box next to Task3
//Verify only Task1 is marked as "Completed"
secondCheckBox.click();
assertEqual("Task1", firstItem.getText()); 
assertEqual("line-through", firstItem.getComputedStyle("text-decoration"));
assertEqual("Task3", secondItem.getText()); 
assertEqual("none", secondItem.getComputedStyle("text-decoration"));

assertEqual ("Mark all as complete",btn_Complete.getText());
assertEqual("1 item", itemText.getText()); 

//Refresh the page. Verify items on the page persist
//agent.gotoUrl("/screening/node_modules/montage/examples/todo-mvc/index.html");
agent.refresh();
agent.wait(3000);

firstItem = agent.element("/HTML/BODY/DIV/UL/LI/DIV/FORM/DIV/LABEL/SPAN[2]");
btn_Complete = agent.element("/HTML/BODY/DIV/FORM[2]/DIV/INPUT");
firstCheckBox = agent.element("/HTML/BODY/DIV/UL/LI/DIV/FORM/DIV/LABEL/INPUT");
secondCheckBox = agent.element("/HTML/BODY/DIV/UL/LI[2]/DIV/FORM/DIV/LABEL/INPUT");
secondItem = agent.element("/HTML/BODY/DIV/UL/LI[2]/DIV/FORM/DIV/LABEL/SPAN[2]");
btn_Clear = agent.element("/HTML/BODY/DIV/DIV/DIV/DIV/FORM/DIV/INPUT");
input = agent.element("/HTML/BODY/DIV/FORM/DIV/LABEL/INPUT");
itemText = agent.element("/HTML/BODY/DIV/DIV/SPAN");

assertEqual("Task1", firstItem.getText()); 

assertEqual("line-through", firstItem.getComputedStyle("text-decoration"));
assertEqual("Task3", secondItem.getText()); 
assertEqual("none", secondItem.getComputedStyle("text-decoration"));

//Mark all tasks as "Complete"
btn_Complete.click();

assertEqual ("Mark all as incomplete",btn_Complete.getText());
assertTrue(firstCheckBox.getAttribute("aria-checked"));
assertTrue(secondCheckBox.getAttribute("aria-checked"));

assertEqual("Task1", firstItem.getText()); 
assertEqual("line-through", firstItem.getComputedStyle("text-decoration"));
assertEqual("Task3", secondItem.getText()); 
assertEqual("line-through", secondItem.getComputedStyle("text-decoration"));

assertEqual("0 items", itemText.getText()); 
assertTrue (agent.doesElementExist("/HTML/BODY/DIV/DIV/DIV/DIV/FORM/DIV/INPUT"));
//Mark all tasks as "Incomplete"
btn_Complete.click();
agent.wait(1000);
assertEqual("false",firstCheckBox.getAttribute("aria-checked"));
assertEqual("false",secondCheckBox.getAttribute("aria-checked"));
assertEqual("Task1", firstItem.getText()); 
assertEqual("none", firstItem.getComputedStyle("text-decoration"));
assertEqual("Task3", secondItem.getText()); 
assertEqual("none", secondItem.getComputedStyle("text-decoration"));
assertEqual("2 items", itemText.getText());
assertFalse(agent.doesElementExist("/HTML/BODY/DIV/DIV/DIV/DIV/FORM/DIV/INPUT"));
  
//Mark all tasks as "Complete" and clear the list
btn_Complete.click();

assertEqual ("Mark all as incomplete",btn_Complete.getText());
assertEqual("true", firstCheckBox.getAttribute("aria-checked"));
assertEqual("true", secondCheckBox.getAttribute("aria-checked"));

assertEqual("Task1", firstItem.getText()); 
assertEqual("line-through", firstItem.getComputedStyle("text-decoration"));
assertEqual("Task3", secondItem.getText()); 
assertEqual("line-through", secondItem.getComputedStyle("text-decoration"));

assertEqual("0 items", itemText.getText()); 
assertTrue (agent.doesElementExist("/HTML/BODY/DIV/FORM[2]/DIV/INPUT"));

btn_Clear.click();
assertEqual("0 items", itemText.getText()); 
assertFalse (agent.doesElementExist("/HTML/BODY/DIV/UL/LI/DIV/FORM/DIV/LABEL/SPAN[2]"));
assertFalse (agent.doesElementExist("/HTML/BODY/DIV/UL/LI[2]/DIV/FORM/DIV/LABEL/SPAN[2]"));

assertFalse (agent.doesElementExist("//*[@id='completedCheckbox']"));
assertFalse (agent.doesElementExist("/HTML/BODY/DIV/UL/LI[2]/DIV/FORM/DIV/LABEL/INPUT"));

assertFalse (agent.doesElementExist("//*[@id='markAllCompleteButton']"));
assertFalse (agent.doesElementExist("//*[@id='clearCompletedForm']/DIV/INPUT"));

assertEqual("0 items", itemText.getText()); 

//Add 20 tasks so the list is scrollable
for (var i=0; i<20; i++) {
  input.sendKeys("Task"+i)
    .sendKeys(Key.ENTER);

 }

btn_Complete.click();

agent.setScroll(0,300);
assertEqual([0,300], agent.getScroll());

btn_Clear.click();

assertEqual("0 items", itemText.getText()); 

//Verify input box is cleared once the task is added to the list
input.sendKeys("Task1")
    .sendKeys(Key.ENTER);

assertEqual("",input.getText());
