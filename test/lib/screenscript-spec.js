/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage;
var ScreenScript = require("screening/common/screen-script").ScreenScript;

describe("ScreenScript", function() {
	
	describe("basic screen script", function() {
		it("should have an run method", function() {
			var screenScript = ScreenScript.create();
			expect(screenScript.run).toBeDefined();
		});
	});
	
	it("should not be a delay", function() {
		var screenScript = ScreenScript.create();
		expect(screenScript.duration).not.toBeDefined();
	});
	
});