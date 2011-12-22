/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */

//
// functions that get expectedValue and actualValue
//

function cleanString(s){
    return (""+s).replace(/\s/g, " ")
}

/**
 * @param {any} expectedValue 
 * @param {any} actualValue
 * @param {String} expectedValue 
 */
var assertContains = exports.assertContains = function(expectedValue, actualValue, msg){
    return cleanString(actualValue).indexOf(cleanString(expectedValue))!=-1
};

/**
 * @param {any} expectedValue 
 * @param {any} actualValue
 * @param {String} expectedValue 
 */
var assertNotContains = exports.assertContainsNot = exports.assertNotContains = function(){
    // Just use the inverted result of assertContains, so we just implement the behvior once and it is consistent.
    return !assertContains.apply(this, arguments);
};

/**
 * @param {any} expectedValue 
 * @param {any} actualValue
 * @param {String} expectedValue 
 */
var assertEqual = exports.assertEqual = exports.assertEquals = function(expectedValue, actualValue, msg){
    // There are (at least) two space-characters (with charcode 32 and 160), unify them before comparing.
    return cleanString(JSON.stringify(actualValue)) == cleanString(JSON.stringify(expectedValue));
};

/**
 * @param {any} expectedValue 
 * @param {any} actualValue
 * @param {String} expectedValue 
 */
var assertNotEqual = exports.assertEqualsNot = exports.assertNotEquals = exports.assertNotEqual = function(){
    // Just use the inverted result of assertEqual, so we just implement the behvior once and it is consistent.
    return !assertEqual.apply(this, arguments);
};

/**
 * @param {any} expectedValue 
 * @param {any} actualValue
 * @param {String} expectedValue 
 */
var assertStartsWith = exports.assertStartsWith = function(expectedValue, actualValue, msg){
    return cleanString(actualValue).indexOf(cleanString(expectedValue))==0;
};
var assertStartsNotWith = exports.assertStartsNotWith = function(expectedValue, actualValue, msg){
    return !assertStartsWith.apply(this, arguments);
};

/**
 * @param {any} expectedValue 
 * @param {any} actualValue
 * @param {String} expectedValue 
 */
var assertEndsWith = exports.assertEndsWith = function(expectedValue, actualValue, msg){
    return cleanString(actualValue).substr(-cleanString(expectedValue).length) == cleanString(expectedValue);
};
var assertEndsNotWith = exports.assertEndsNotWith = function(expectedValue, actualValue, msg){
    return !assertEndsWith.apply(this, arguments);
};

/**
 * @param {any} expectedValue 
 * @param {any} actualValue
 * @param {String} expectedValue 
 */
var assertLess = exports.assertLess = function(expectedValue, actualValue, msg){
    if (!isNaN(parseFloat(expectedValue, 10)) && !isNaN(parseFloat(actualValue, 10))){
        return parseFloat(actualValue, 10) < parseFloat(expectedValue, 10);
    } else {
        return (""+actualValue).replace(/\s/g, " ") < (""+expectedValue).replace(/\s/g, " ");
    }
};
var assertGreaterOrEqual = exports.assertGreaterOrEqual = function(expectedValue, actualValue, msg){
    return !assertLess.apply(this, arguments);
};

/**
 * @param {any} expectedValue 
 * @param {any} actualValue
 * @param {String} expectedValue 
 */
var assertGreater = exports.assertGreater = function(){
    return !assertLess.apply(this, arguments) && !assertEqual.apply(this, arguments);
};
var assertLessOrEqual = exports.assertLessOrEqual = function(){
    return !assertGreater.apply(this, arguments);
};

/**
 * @param {Array(2)} expectedValue, The first value is the lower value, the second the higher.
 * @param {any} actualValue
 * @param {String} expectedValue 
 */
var assertBetween = exports.assertBetween = function(expectedValue, actualValue, message){
    var min = expectedValue[0];
    var max = expectedValue[1];
    if (!isNaN(parseFloat(expectedValue[0])) && !isNaN(parseFloat(expectedValue[1]))){
        min = Math.min(parseFloat(expectedValue[0]), parseFloat(expectedValue[1]));
        max = Math.max(parseFloat(expectedValue[0]), parseFloat(expectedValue[1]));
    }
    return assertGreater(min, actualValue) && assertLess(max, actualValue);
};

var assertNotBetween = exports.assertNotBetween = function(expectedValue, actualValue, message){
    return !assertBetween.apply(this, arguments);
}

/**
 * @param {Array(2)} expectedValue, The first value is the value, the second the offset.
 * @param {any} actualValue
 * @param {String} expectedValue 
 */
var assertPrecision = exports.assertPrecision = function(expectedValue, actualValue, message){
    var middle = expectedValue[0];
    var offset = Math.abs(expectedValue[1]); // Ensure its a positive number (a negative offset would make no sense - saving the user here :)).
    return assertGreater(middle-offset, actualValue) && assertLess(middle+offset, actualValue);
};
var assertNotPrecision = exports.assertNotPrecision = function(expectedValue, actualValue, message){
    return !assertPrecision.apply(this, arguments)
};

//
// functions that require no expectedValue, since it is explicitly defined by the function (name)
//

/**
 * @param {any} actualValue
 * @param {String} expectedValue 
 */
var assertTrue = exports.assertTrue = function(actualValue, msg){
    return !!actualValue;
};

/**
 * @param {any} actualValue
 * @param {String} expectedValue 
 */
var assertFalse = exports.assertFalse = function(){
    // Just use the inverted result of assertTrue, so we just implement the behvior once and it is consistent.
    return !assertTrue.apply(this, arguments); 
};

/**
 * @param {any} actualValue
 * @param {String} expectedValue 
 */
var assertEmpty = exports.assertEmpty = function(actualValue, msg){
    return !actualValue;
};

/**
 * @param {any} actualValue
 * @param {String} expectedValue 
 */
var assertNotEmpty = exports.assertNotEmpty = function(){
    // Just use the inverted result of assertEmpty, so we just implement the behvior once and it is consistent.
    return !assertEmpty.apply(this, arguments);
};

/**
 * List the methods that don't have the first parameter, expected value.
 */
exports.hasNoExpectedValue = "assertTrue assertFalse assertEmpty assertNotEmpty".split(" ");

//
// a special use case, it gets the assert function passed as first param
//

/**
 * @param {Function} assertFunc
 * @param {any} expectedValue 
 * @param {any} actualValue
 * @param {String} expectedValue 
 */
//assert = function(assertFunc, expectedValue, actualValue, msg){
//    return assertFunc(expectedValue, actualValue, msg);
//},
