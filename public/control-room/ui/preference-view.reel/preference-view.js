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

