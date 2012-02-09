/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */

var Session = require("../webdriver/session.js").Session;

var createWebdriverSession = exports.createWebdriverSession = function(url) {
    var session = new Session({url: url});
    session.init = function(caps, cb){
        caps = caps ? caps : {};
        caps['browserName'] = 'chrome';
        this.startSession(caps).then(cb, function(errorBody) {
            console.error("**** WEBDRIVER START SESSION REJECTED! *****", errorBody);
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
    RIGHT  : 2,
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
    COMMAND   : "\ue03D",
};

