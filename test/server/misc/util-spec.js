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
