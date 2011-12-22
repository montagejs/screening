/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
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