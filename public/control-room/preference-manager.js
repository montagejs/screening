/* <copyright>
Copyright (c) 2012, Motorola Mobility LLC.
All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of Motorola Mobility LLC nor the names of its
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
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
