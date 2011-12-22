// ==== Start Recorded Script, Thu Oct 27 2011 16:00:00 GMT-0700 (PDT)==== 

var agent = new Agent();

agent.gotoUrl("/webapps/screening/public/sample/sample.html");

// Test Values
var toggleValueComponent = agent.component("/html/body/form/div[3]/input");
//var toggleValueComponent = agent.component("#toggleValue");
assertEqual(false, toggleValueComponent.getProperty("value"));

toggleValueComponent.setProperty("value", "works!");
assertEqual("works!", toggleValueComponent.getProperty("value"));

// Bindings with Setable values

var slider = agent.component("//div[contains(@class, 'montage-slider')]");
//var slider = agent.component("#slider");
slider.setProperty("value", 12);

var sliderValue = agent.component("//form/div[2]/input[contains(@class, 'montage-textfield')]");
//var sliderValue = agent.component("#sliderValue");
assertEqual(12, sliderValue.getProperty("value"));

// Test Chaining
toggleValueComponent.setProperty("value", "one").setProperty("value", "two");
assertEqual("two", toggleValueComponent.getProperty("value"));

// Test Methods

agent.wait(5000);