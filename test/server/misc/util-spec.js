/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var getStackTrace = require("../../../server/lib/util.js").getStackTrace;

// We use this as offset, so don't have to change all tests if we just insert one line somewhere.
var LINE_OFFSET = 9;

describe('util.getStackTrace()', function() {
    
    it('works without parameters', function() {
        LINE_OFFSET = LINE_OFFSET + 5;
        // Does it work at all?
        var s = getStackTrace();
        expect(s[0].lineNumber).toEqual(LINE_OFFSET+2);
        expect(s[0].columnNumber).toEqual(17);
        
        // On a different column and line too?
        var s =    getStackTrace();
        expect(s[0].lineNumber).toEqual(LINE_OFFSET+7);
        expect(s[0].columnNumber).toEqual(20);
        
        // Outside of the expect? (you never know :))
        var s =       getStackTrace();
        expect(s[0].lineNumber).toEqual(LINE_OFFSET+12);
        expect(s[0].columnNumber).toEqual(23);
    });
    
    it('works with ONE parameter', function() {
        LINE_OFFSET = LINE_OFFSET + 18;
        // Does it work?
        var s = getStackTrace("util-spec.js");
        expect(s[0].lineNumber).toEqual(LINE_OFFSET+2);
        expect(s[0].columnNumber).toEqual(17);
        // Does it work a second time too?
        var s = getStackTrace("util-spec.js")
        expect(s[0].lineNumber).toEqual(LINE_OFFSET+6);
        expect(s[0].columnNumber).toEqual(17);
    });
    
    it('works with TWO parameters', function() {
        LINE_OFFSET = LINE_OFFSET + 12;
        // Does it work?
        var s = getStackTrace("util-spec.js", 1);
        expect(s[0].lineNumber).toEqual(1001);
        expect(s[0].columnNumber).toEqual(15);
        // Does it work a second time too?
        var s = getStackTrace("util-spec.js", 0)
        expect(s[0].lineNumber).toEqual(LINE_OFFSET+6);
        expect(s[0].columnNumber).toEqual(17);
    });
});
