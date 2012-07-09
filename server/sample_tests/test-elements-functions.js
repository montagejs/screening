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



var nodes = [];

nodes.push(agent.element("/html/body/div/input"));
nodes.push(agent.element("#testCheckbox"));
nodes.push(agent.element(".scrollTest"));


//length
assertEqual(3, nodes.length);

//setAttribute
//getComputedStyle
for (i=0;i<nodes.length;i++)
{
  nodes[i].setAttribute("style", "color:red");
  assertEqual("rgb(255, 0, 0)", nodes[i].getComputedStyle("color"));
}


// getAttribute
expected = ["text", "checkbox", null];

for (i=0;i<nodes.length;i++)
{
  assertEqual(expected[i], nodes[i].getAttribute("type"));
}

// getText
var text = [];
for(i = 0; i < agent.elements("h2").length; ++i) {
 text.push(agent.elements("h2")[i].getText());
}
assertEqual(["Loooong text","Loooong text","Loooong text","Loooong text","Loooong text","Loooong text","Loooong text","Loooong text","Loooong text","Loooong text"], text);

// isVisible
for (i=0;i<nodes.length;i++)
{
  assertEqual(true, nodes[i].isVisible());
}

// isEnabled
for (i=0;i<nodes.length;i++)
{
  assertEqual(true, nodes[i].isEnabled());
}


