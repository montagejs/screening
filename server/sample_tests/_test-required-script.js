//This script contains library of functions used by "test-script"
//Do not execute thie script by itself!

//
// The first parameter is always the global context, that contains
// everything that is global in the parent test script.
//

exports.simpleTests = function(globalObj){
    globalObj.assertTrue(true, "I am the required script, and if you see this I was required :)");
    globalObj.assertFalse(false);
}

// The agent is passed in as the first parameter to the funcWithParameters() call,
// here it is the second, since we always pass in the globalObj as the first parameter
// to have access to everything that is global in the test script.
exports.funcWithParameters = function(globalObj, agent){
    globalObj.assertEqual("Simple UI Sample", agent.getTitle());
    globalObj.assertTrue(agent.doesElementExist("body"));
}
