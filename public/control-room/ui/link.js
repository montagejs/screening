/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage;
var Component = require("montage/ui/component").Component;

exports.Link = Montage.create(Component, {
    hasTemplate: {
        value: false
    },

    _link: {
        enumerable: false,
        value: null
    },

    link: {
        get: function() {
            return this._link;
        },
        set: function(link) {
            if (this._link !== link) {
                this.needsDraw = true;
            }
            this._link = link;
        }
    },

    draw: {
        value: function() {
            if (this.link) {
                this.element.setAttribute("href", this.link);
            }
        }
    }
});