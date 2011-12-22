/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */

var Montage = require("montage/core/core").Montage;

var ActionResult = exports.ActionResult = Montage.create(Montage, {
    success: {
        value: function(step) {
            this.step = step;
            this.status = "SUCCESS";
            return this;
        }
    },

    fromException: {
        value: function(step, ex) {
            this.step = step;
            this.status = "ERROR";
            this.message = ex.message;
            this.stack = ex.stack;
            
            return this;
        }
    },

    step: {
        serializable: true,
        value: null
    },

    status: {
        serializable: true,
        value: null
    },

    message: {
        serializable: true,
        value: null
    },

    stack: {
        serializable: true,
        value: null
    }
});