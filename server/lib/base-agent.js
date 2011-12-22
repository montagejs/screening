/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var friendlyNames = require("./friendly-names.js"),
    color = require("ansi-color").set;

var BaseAgent = exports.BaseAgent = Object.create(Object, {
    init: {
        value: function() {
            this.friendlyName = friendlyNames.getNext();
            return this;
        }
    },
    
    id: {
        value: null
    },
    
    friendlyName: {
        value: null
    },
    
    isBusy: {
        value: false
    },
    
    capabilities: {
        value: null
    },
    
    type: {
        value: null
    },
    
    address: {
        value: null
    },

    runner: {
        value: null
    },
    
    /**
     * Get a serializable summary of the agent object,
     * @returns JSON serializable object
     */
    getSummary: {
        value: function() {
            var self = this;
            return {
                id: self.id,
                capabilities: self.capabilities,
                friendlyName: self.friendlyName,
                address: self.address,
                isBusy: self.isBusy,
                type: self.type
            }
        }
    },
    
    /**
     * Signal that a test has started on this agent
     */
    startTest: {
        value: function() {
            this.isBusy = true;
        }
    },

    /**
     * Signal that a test has completed executing on this agent
     * 
     * @param {Object} Result of the test execution
     */
    endTest: {
        value: function() {
            this.isBusy = false;
        }
    },
    
    /**
     * Process a log message returned from the agent
     * @param log Log message to process
     */
    processLog: {
        value: function(log) {
            switch(log.level) {
               case "info":
                    console.log(color("[Info] ", "cyan") + this.friendlyName + " : " + log.message, log.stack || "");
                    break;
               case "warn":
                    console.log(color("[Warn] ", "yellow") + this.friendlyName + " : " + log.message, log.stack || "");
                    //this.socket.broadcast.to("drivers").emit("logMessage", this.socket.id, log);
                    break;
               case "error":
                    console.log(color("[Error] ", "red") + this.friendlyName + " : " + log.message, log.stack || "");
                    //this.socket.broadcast.to("drivers").emit("logMessage", this.socket.id, log);
                    break;
               case "fatal":
                    console.log(color("[Fatal] " + this.friendlyName + " : " + log.message, "red+bold"), log.stack || "");
                    //this.socket.broadcast.to("drivers").emit("logMessage", this.socket.id, log);
                    this.endTest();
                    break;
            }
            if(log.exception && log.exception.stack) {
                console.log(log.exception.stack);
            }
        }
    },

    updateProgress: {
        value: function(count, total) {
        }
    }
    
});