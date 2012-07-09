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
var agent = new Agent();

agent.gotoUrl("/screening/samples/sample.html");

agent.setWindowSize(927, 989);

agent.mouseMove([{"x":359,"y":153,"duration":0},{"x":307,"y":155,"duration":1044}]);
agent.mouseDown(307,155);
agent.mouseMove([{"x":311,"y":155,"duration":0},{"x":527,"y":155,"duration":479}]);
agent.mouseUp(527,155);
agent.wait(1200);

agent.mouseDown(526,155);
agent.mouseDown(526,155);
agent.mouseMove([{"x":523,"y":153,"duration":0},{"x":392,"y":154,"duration":267},{"x":291,"y":169,"duration":446}]);
agent.mouseUp(291,169);
agent.mouseMove([{"x":289,"y":169,"duration":0},{"x":263,"y":207,"duration":172},{"x":294,"y":197,"duration":95},{"x":344,"y":130,"duration":101},{"x":334,"y":143,"duration":183},{"x":300,"y":153,"duration":617}]);
agent.mouseDown(300,153);
agent.mouseMove([{"x":301,"y":153,"duration":0},{"x":535,"y":145,"duration":596}]);
agent.mouseUp(535,145);
agent.mouseMove([{"x":535,"y":146,"duration":0},{"x":508,"y":171,"duration":163},{"x":507,"y":195,"duration":100},{"x":535,"y":211,"duration":150},{"x":589,"y":210,"duration":267},{"x":729,"y":183,"duration":117},{"x":924,"y":116,"duration":200}]);


