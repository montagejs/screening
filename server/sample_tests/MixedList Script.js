var agent = new Agent();

agent.gotoUrl("/screening/node_modules/montage/samples/mixed-list/index.html");

agent.setWindowSize(927, 956);

assertEqual("Add", agent.element("/HTML/BODY/BUTTON").getText())
assertEqual("InputRadio", agent.component("/HTML/BODY/DIV/DIV[2]/UL/LI[1]/INPUT").getObjectName());

var arrayComponents = ["InputRadio","InputRange","InputCheckbox"];
var j=2;
var component;

while (arrayComponents.length != 0)
   {
   agent.element("/HTML/BODY/BUTTON").click(Mouse.LEFT,22,6);
   agent.wait(2000);
     
   component = agent.component("/HTML/BODY/DIV/DIV[2]/UL/LI["+j+"]/*").getObjectName();
 
   j++; 
     
   var index = arrayComponents.indexOf(component);
     
   if (index != -1)  
     arrayComponents.splice(index, 1);  
   }
