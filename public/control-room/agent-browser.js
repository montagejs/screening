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

exports.AgentBrowser = Montage.create(Montage, {
    info: {
        value: null,
    },

    _testing: {
        enumerable: false,
        value: false
    },

    testing: {
        get: function() {
            return this._testing;
        },
        set: function(value) {
            this._testing = value;
        }
    },

    _messages: {
        enumerable: false,
        value: [],
        distinct: true,
    },

    messages: {
        get: function() {
            return this._messages;
        },
        set: function(value) {
            this._messages = value;
        }
    },

    warnCount: {
        value: 0
    },

    errorCount: {
        value: 0
    },

    fatalCount: {
        value: 0
    },

    totalSteps: {
        value: 10
    },

    stepsCompleted: {
        value: 0
    },

    log: {
        value: function(message) {
            this.messages.push(message);
            switch(message.level) {
                case "warn": this.warnCount++; break;
                case "error": this.errorCount++; break;
                case "fatal": this.fatalCount++; break;
            }
        }
    },

    clearLog: {
        value: function(message) {
            this.messages = [];
            this.warnCount = 0;
            this.errorCount = 0;
            this.fatalCount = 0;
        }
    }
});
