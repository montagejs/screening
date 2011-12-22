/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */

var Q = require("q");

var Sync = exports.Sync = Object.create(Object, {
    init: {
        value: function() {
            this._resultStack = [];
            this._passCount = 0;
            return this;
        }
    },
    
    _resultStack: {
        value: null
    },
    
    _resultOffset: {
        value: 0
    },
    
    _resultPending: {
        value: false
    },
    
    _passCount: {
        value: 0
    },
    
    _syncCode: {
        value: null
    },
    
    _defer: {
        value: null
    },
    
    /**
     * Synchronizes execution of a promise
     *
     * @param {function} promiseGenerator A function that returns a promise.
     * @param {function} resultCallback An optional callback function that will be passed the result of the generated promise and allowed to transform it before pushing to the result stack
     * @return {Object} The synchronized result
     */
    promise: {
        value: function(promiseGenerator, resultCallback) {
            var self, promise;
            if(this._resultStack.length > this._resultOffset) {
                this._resultOffset++;
                return this._resultStack[this._resultOffset - 1];
            }
            
            if(this._resultPending) {
                throw new Error("Encountered nested synchronous promises. Cannot create a new synchronous promise while a previous one is still outstanding.");
            }
            
            var scriptErrHolder = new Error();
            
            self = this;
            promiseGenerator(this).then(function(result) {
                self._resultPending = false;
                if(resultCallback) {
                    result = resultCallback(result);
                }
                self._resultStack.push(result);
                self._doSyncPass();
            }, function(err) {
                self._resultPending = false;
                scriptErrHolder.message = (err.value ? err.value.message : err);
                self._defer.reject(scriptErrHolder);
            });
            this._resultPending = true;
            
            throw { isSyncException: true };
        }
    },
    
    /**
     * Run a synchronous call, but ensure that it only evaluates once throughout all the passes
     *
     * @param {function} syncFunction Synchronous function that should only be executed once
     * @return {Object} The result of the synchronous call
     */
    once: {
        value: function(syncFunction, resultCallback) {
            var result;
            if(this._resultStack.length > this._resultOffset) {
                this._resultOffset++;
                return this._resultStack[this._resultOffset - 1];
            }
            
            result = syncFunction(this);
            this._resultStack.push(result);
            this._resultOffset++;
            return result;
        }
    },
    
    runSync: {
        value: function(code) {
            this._defer = Q.defer();
            
            this._syncCode = code;
            this._doSyncPass();
            
            return this._defer.promise;
        }
    },
    
    _doSyncPass: {
        value: function() {
            var result;
            
            this._passCount++;
            try {
                this._resultOffset = 0; // Rest the result stack pointer
                result = this._syncCode(this); // Execute the code
                // And now we expect it to fail...
                // ..
                // .
            } catch (ex) {
                // If it's not a synchronization exception, allow it to propegate
                if(!ex.isSyncException) { 
                    //console.log("Unexpected Exception... Aborting script execution after pass " + this._passCount);
                    this._defer.reject(ex);
                }
                
                // Otherwise we can safely ignore it and assume that a promise will eventually pick up the execution again.
                return;
            }
            
            // Holy crap, we actually made it? Better clean up then!
            //console.log("Script Succeeded in " + this._passCount + " pass(es).");
            // Clear out the results (we don't need them any more)
            this._resultStack = [];
            // Call the callback to notify the system that we've finished successfully
            this._defer.resolve(result);
        }
    },
    
});