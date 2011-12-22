/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var Montage = require("montage/core/core").Montage;

var Preferences = [
    {
        "type": "boolean",
        "name": "Global Exit on Failure",
        "shortName": "exitOnFailure",
        "defaultValue": "false"
    },
    {
        "type": "select",
        "name": "Sync Mode",
        "shortName": "sync.mode",
        "options": [
            "auto",
            // "webdriver.default",
            // "body.innerHTML",
            "none"
           // "montage.draw*" // Not yet Implemented
        ],
        "defaultValue": "blue"
    },
    {
        "type": "text",
        "name": "Global Timeout",
        "shortName": "timeout",
        "defaultValue": "200"
    }
];

exports.PreferenceManager = Montage.create(Montage, {
    PREFERENCE_PREFIX: {
        value: "Screening.Preferences."
    },
    
    getPreferences : {
        value: function() {
            var preferences = [];
            var i;
            for(i = 0; i < Preferences.length; ++i) {
                var pref = Preferences[i];
                var key = this.PREFERENCE_PREFIX + pref.shortName;

                var val;
                if(localStorage[key]) {
                    val = localStorage[key];
                } else {
                    val = pref.defaultValue;
                }
                
                var prefObj = Montage.create(Montage, {
                    "type": { value: pref.type},
                    "name": { value: pref.name},
                    "key": { value: key},
                    "shortName": { value: pref.shortName},
                    "options": { value: pref.options},
                    "_value": { value: val},
                    "value": {
                        get: function(){
                            if(this.type == "boolean") {
                                return this._value == "true";
                            }
                            return this._value;
                        },
                        set: function(value) {
                            if(this._value !== value) {
                                this._value = value;
                                localStorage[this.key] = this._value;
                            }
                        }
                    }
                });
                
                preferences.push(prefObj);
            }
            
            return preferences;
        }
    },
    
    // TODOz: depricated, try to remove
    savePreferences: {
        value: function(prefs) {
            // TODO: there is no way this is working right now.
            for(var i = 0; i < prefs.length; ++i) {
                var key = prefs[i].shortName;
                var value = prefs[i].value;
                if(value) {
                    localStorage[key] = value;
                }
            }
        }
    }
});