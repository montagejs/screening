/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
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