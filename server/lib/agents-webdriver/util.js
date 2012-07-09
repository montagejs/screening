/* <copyright>
Copyright (c) 2012, Motorola Mobility, Inc
All Rights Reserved.
BSD License.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

  - Redistributions of source code must retain the above copyright notice,
    this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.
  - Neither the name of Motorola Mobility nor the names of its contributors
    may be used to endorse or promote products derived from this software
    without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
</copyright> */

var Session = require("../webdriver/session.js").Session;

var createWebdriverSession = exports.createWebdriverSession = function(url) {
    var session = new Session({url: url});
    session.init = function(caps, cb){
        caps = caps ? caps : {};
        this.startSession(caps).then(cb, function(err) {
            console.error("**** WEBDRIVER START SESSION REJECTED! *****", err);
            cb(err);
        });
    }
    return session;
};

var resultFilter = exports.resultFilter = function(ret) {
    return ret.value;
};

/**
 * Enumerated values for mouse buttons
 */
var Mouse = exports.Mouse = {
    LEFT   : 0,
    MIDDLE : 1,
    RIGHT  : 2
};

/**
 * Enumerated values for non-alphanumeric keys
 */
var Key = exports.Key = {
    CANCEL    : "\ue001",
    HELP      : "\ue002",
    BACKSPACE : "\ue003",
    TAB       : "\ue004",
    CLEAR     : "\ue005",
    RETURN    : "\ue006",
    ENTER     : "\ue007",
    SHIFT     : "\ue008",
    CONTROL   : "\ue009",
    ALT       : "\ue00A",
    PAUSE     : "\ue00B",
    ESCAPE    : "\ue00C",
    SPACE     : "\ue00D",
    PAGEUP    : "\ue00E",
    PAGEDOWN  : "\ue00F",
    END       : "\ue010",
    HOME      : "\ue011",
    LEFT      : "\ue012",
    UP        : "\ue013",
    RIGHT     : "\ue014",
    DOWN      : "\ue015",
    INSERT    : "\ue016",
    DELETE    : "\ue017",
    SEMICOLON : "\ue018",
    EQUALS    : "\ue019",
    NUM0      : "\ue01A",
    NUM1      : "\ue01B",
    NUM2      : "\ue01C",
    NUM3      : "\ue01D",
    NUM4      : "\ue01E",
    NUM5      : "\ue01F",
    NUM6      : "\ue020",
    NUM7      : "\ue021",
    NUM8      : "\ue022",
    NUM9      : "\ue023",
    MULTIPLY  : "\ue024",
    ADD       : "\ue025",
    SEPARATOR : "\ue026",
    SUBTRACT  : "\ue027",
    DECIMAL   : "\ue028",
    DIVIDE    : "\ue029",
    F1        : "\ue031",
    F2        : "\ue032",
    F3        : "\ue033",
    F4        : "\ue034",
    F5        : "\ue035",
    F6        : "\ue036",
    F7        : "\ue037",
    F8        : "\ue038",
    F9        : "\ue039",
    F10       : "\ue03A",
    F11       : "\ue03B",
    F12       : "\ue03C",
    COMMAND   : "\ue03D"
};

