// ==== Start Recorded Script, Thu Oct 27 2011 16:00:00 GMT-0700 (PDT)==== 

var agent = new Agent();

agent.gotoUrl("/screening/samples/sample.html");
// Test Values
var toggleValueComponent = agent.component("/html/body/form/div[3]/input");
assertEqual(false, toggleValueComponent.getProperty("value"));

toggleValueComponent.setProperty("value", "works!");
assertEqual("works!", toggleValueComponent.getProperty("value"));

// Bindings with Setable values

var slider = agent.component("//div[contains(@class, 'montage-slider')]");
slider.setProperty("value", 12);

var sliderValue = agent.component("//form/div[2]/input[contains(@class, 'montage-textfield')]");
assertEqual(12, sliderValue.getProperty("value"));

// Test Chaining
toggleValueComponent.setProperty("value", "one").setProperty("value", "two");
assertEqual("two", toggleValueComponent.getProperty("value"));


agent.wait(5000);