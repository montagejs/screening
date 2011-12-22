/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var ScriptClass = require("../../../server/lib/testcase/script.js").Script;
var script = new ScriptClass({});

describe("The script object", function() {
    it("has method getOption", function() {
        expect(typeof script.getOption).toBe("function");
    });
    it("has method getOptions", function() {
        expect(typeof script.getOptions).toBe("function");
    });
    it("has method setOption", function() {
        expect(typeof script.setOption).toBe("function");
    });
    it("has method require", function() {
        expect(typeof script.require).toBe("function");
    });
    it("does not have a global.loadTimeout property", function() {
        expect(script.getOption("global.loadTimeout")).toBeUndefined();
    });
    it("does not have a global.timeout property", function() {
        expect(script.getOption("global.timeout")).toBeUndefined();
    });
});


describe("The method setOption()", function() {
    it("sets and getOption() gets the same value", function() {
        script.setOption("timeout", 1337);
        expect(script.getOption("timeout")).toBe(1337);
    });
});
