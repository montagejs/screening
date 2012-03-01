/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage;

exports.Keyboard = Montage.create(Montage, {
    /**
    Mapping for Key Names to Key Code
      @private
    */
    keyNames: {
        enumerable: false,
        value: {
            "BACKSPACE": 8,
            "TAB": 9,
            "ENTER": 13,
            "ESCAPE": 27,
            "PAGEUP": 33,
            "PAGEDOWN": 34,
            "END": 35,
            "HOME": 36,
            "LEFT": 37,
            "UP": 38,
            "RIGHT": 39,
            "DOWN": 40,
            "INSERT": 45,
            "DELETE": 46
        }
    }
    
});


