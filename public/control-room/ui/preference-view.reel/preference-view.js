/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage;
var Component = require ("montage/ui/component").Component;
var PreferenceManager = require("control-room/preference-manager").PreferenceManager;

exports.PreferenceView = Montage.create(Component, {
    
    _storageIssue: {
        value: false
    },
    
    preferences: { // TODO rename this to be be somethign better, it's not a list really.
        value: [],
        distinct: true
    },
    
    preferenceRepetition: {
        value: null
    },
    
    prepareForDraw: {
        value: function() {
            try {
                localStorage['screening.test.local.storage.availability'] = 'test';
                localStorage.removeItem('screening.test.local.storage.availability');
                this.preferences = PreferenceManager.getPreferences();
            } catch (e) {
                console.error(e);
                this._storageIssue = true;
                return;
            }
        }
    },
    
    draw: {
        value: function() {
            if(this._storageIssue) {
                this.preferenceRepetition.element.style.display = "none";
                
                var storageMessage = document.createElement('div');
                storageMessage.setAttribute('class', 'storageIssue');
                storageMessage.innerText = "There is an issue with local storage, maybe you have your cookies disabled?"

                this.preferenceRepetition.element.parentElement.appendChild(storageMessage);
            }
        }
    }
});

