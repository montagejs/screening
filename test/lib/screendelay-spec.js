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
var Montage = require("montage/core/core").Montage;
var ScreenDelay = require("screening/common/screen-delay").ScreenDelay;

describe("ScreenDelay", function() {
	describe("basic screen script", function() {
		it("should have an run method", function() {
			var screenDelay = ScreenDelay.create();
			expect(screenDelay.run).toBeDefined();
		});
	});

	it("should have a delay property defined", function() {
		var screenDelay = ScreenDelay.create();

		expect(screenDelay.duration).toBeNull();

		screenDelay.duration = 12;

		expect(screenDelay).toBeDefined(screenDelay.duration);
		expect(screenDelay).not.toBeNull();
		expect(screenDelay.duration).toEqual(12);
	});

    it("should not be saved when duration is null", function(){
        var screenDelay = ScreenDelay.create();
        screenDelay.duration = null;
        expect(screenDelay.Save()).toThrow("duration must be positive number");

    });

    it("should only accept positive numeric values", function(){
        var screenDelay = ScreenDelay.create();
        screenDelay.duration = -5;
        expect(screenDelay.Save()).toThrow("duration must be positive number");

        screenDelay.duration = "abc";
        expect(screenDelay.Save()).toThrow("duration must be positive number");
        screenDelay.duration = "!@#";
        expect(screenDelay.Save()).toThrow("duration must be positive number");


    });
});
