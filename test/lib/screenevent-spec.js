/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage;
var ScreenEvent = require("screening/common/screen-event").ScreenEvent;

describe("ScreenEvent", function() {
	
	describe("basic screen event", function() {
		it("should have an run method", function() {
			var screenEvent = ScreenEvent.create();
			expect(screenEvent.run).toBeDefined();
		});
	}); 
	
	it("should not be a delay", function() {
		var screenEvent = ScreenEvent.create();
		expect(screenEvent.Delay).not.toBeDefined();
	});
	
});