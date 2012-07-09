/* <copyright>
Copyright (c) 2012, Motorola Mobility LLC.
All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of Motorola Mobility LLC nor the names of its
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
</copyright> */
script.setOption("sync.mode", "none");

var agent = new Agent();
agent.gotoUrl("/screening/control-room/ui-sample.html");


var inputNode = agent.element("#testInput");
var checkboxNode = agent.element("#testCheckbox");
var scrollArea = agent.element(".scrollTest");

//isFocused
agent.wait(2000); // Give user time to focus!
inputNode.focus()
assertTrue(inputNode.isFocused());

//setAttribute
inputNode.setAttribute("style", "color:red");

// getComputedStyle
assertEqual(inputNode.getComputedStyle("color"), "rgb(255, 0, 0)");

// getAttribute
assertEqual(inputNode.getAttribute("type"), "text");

// getAttribute
var type = inputNode.getAttribute("type");
assertTrue(type == "text");
assertFalse(type == "NONSENSE");


// getText
inputNode.sendKeys("call me back");
assertEqual("call me back", inputNode.getText());

// getInnerHTML
assertEqual("UI Control Sample", agent.element("h1").getInnerHtml());

// getInnerText
assertEqual("UI Control Sample", agent.element("h1").getInnerText());

// isVisible
assertTrue(inputNode.isVisible());

// isEnabled
assertTrue(inputNode.isEnabled());

// isChecked
assertFalse(checkboxNode.getChecked());
checkboxNode.click();
assertTrue(checkboxNode.getChecked());

// doesExist
assertTrue(agent.doesElementExist("#testCheckbox"));
assertFalse(agent.doesElementExist("selectNoneExistingElement"));

//dispatchEvent
//getScroll
assertEqual(scrollArea.getScroll(), [0,0]);

// setScroll
scrollArea.setScroll(0,2);
assertEqual(scrollArea.getScroll(), [0,2]);

// setScroll
scrollArea.setScroll(0,6);
assertEqual(scrollArea.getScroll(), [0,6]);

//*/
