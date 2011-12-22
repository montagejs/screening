/* <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> */
var request = require('../../../server/node_modules/request'),
    template = require('../../../server/node_modules/template'),
    spawn = require('child_process').spawn,
    waitsForAsync = require('../util.js').waitsForAsync,
    initServer = require('../util.js').initServer,
    connectPhantomAgent = require('../util.js').connectPhantomAgent;

const JSON_CONTENT_TYPE = 'application/json; charset=utf-8';
const PORT = 8082; // don't interfere with the normal screening port
// start the server to test
const BASE_URL = 'http://127.0.0.1:' + PORT + '/screening/api/v1';

initServer(PORT);
describe('REST Error handling', function() {
    it('tests a service not yet implemented', function() {
        request.get({
            uri: BASE_URL + '/foo?api_key=2112'
        }, waitsForAsync(function(error, response, body) {
            expect(response.statusCode).toEqual(404);
        }));
    });

    it('tests a request without the api_key', function() {
        request.get({
            uri: BASE_URL + '/foo'
        }, waitsForAsync(function(error, response, body) {
            expect(response.headers['content-type']).toEqual(JSON_CONTENT_TYPE);
            expect(response.statusCode).toEqual(401);
        }));
    });
});

describe('REST /agents/:id', function() {
    it('tests getting a specific agent', function() {
        //TODO: Complete this test, for now it's just creating a URL using template
        var url = template.create(BASE_URL + '/agents/<%=agentId%>', {agentId: 1});
    });
});




/////PHANTOMJS Tests : fails because port 8081 is hardcoded inside public/agent/lib/iframe-agent.js , so will not work when screening server is on port 8082
//describe('REST /agents', function() {
//    initServer(PORT);
//    it('tests empty agents', function() {
//        request.get({
//            uri: BASE_URL + '/agents/?api_key=2112'
//        }, waitsForAsync(function(error, response, body) {
//            expect(body).toEqual('[]');
//            expect(response.statusCode).toEqual(200);
//            expect(response).toBeTruthy();
//        }));
//    });
////
//    it('tests at least one agent', function() {
//        var phantomjs = connectPhantomAgent(PORT);
//
//        runs(function() {
//            request.get({
//                uri: BASE_URL + "/agents/?api_key=2112"
//            }, waitsForAsync(function(error, response, body) {
//                expect(body).toNotEqual("[]");
//                 console.log("inside tests atleast one agent"+response.body);
//                expect(response.statusCode).toEqual(200);
//                expect(response).toBeTruthy();
//            }));
//        });
//
//        runs(function() {
//           // phantomjs.kill();
//        });
//    });
//});


describe('REST /scripts', function() {
    //this test works

    xit('tests getting all the scripts', function() {
        request.get({
            uri: BASE_URL + '/scripts?api_key=2112'
        }, waitsForAsync(function(error, response, body) {
            expect(response.statusCode).toEqual(200);
            //console.log("inside REST/SCRIPTS"+response.statusCode);
            expect(response).toBeTruthy();
            expect(response.header('Content-Type')).toEqual('application/json; charset=utf-8');
        }));
    });


    xit('should allow you to create a new script', function() {
        var script1 = {

            "code": "123_awesome",
            "name": "awesomeScript_22"

        };
         var script_id;
         var json_script1=JSON.stringify(script1);
        runs(function() {
            request.post({
                uri: BASE_URL + '/scripts/?api_key=5150',
                headers: {
                    "Content-Type": "application/json"
                },
                //body: JSON.stringify(script1)
                body: json_script1
            }, waitsForAsync(function(error,response,body){
                var bodyObj = JSON.parse(body);
                expect(response.statusCode).toEqual(200);
               expect(bodyObj.name).toEqual(script1.name);
                expect(bodyObj.code).toEqual(script1.code);
            }));
        });

        //To get the id of the test script using test script name, id will be used to delete the script below
        runs(function() {
            request.get({
                uri: BASE_URL + '/scripts?name=' + script1.name + '&api_key=5150'
            }, waitsForAsync(function(error, response, body) {
                var bodyObj = JSON.parse(body);
                console.log(bodyObj);
                expect(response.statusCode).toEqual(200);
                //console.log("inside REST/SCRIPTS" + response.statusCode);
                script_id = bodyObj[0]._id;
                console.log("id of the test script" + bodyObj[0]._id);

            }));
        });

        // Clean Up the script (this needs to be tested somewhere else)
        runs(function(){
            request({
                method: "delete",
                uri: BASE_URL + "/scripts/" +script_id+ "?api_key=5150"
            }, waitsForAsync(function(error, response, body) {
                expect(response.statusCode).toEqual(200);
            }))
        });
    });


    xit('should allow you to delete a new script', function() {
        var script1 = {
            name: "awesomeScript_9",
            code: "awesome"

        };

        runs(function() {
            request.post({
                uri: BASE_URL + '/scripts/?api_key=5150',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(script1)
            }, waitsForAsync(function(error,response,body){
                var bodyObj = JSON.parse(body);
                expect(response.statusCode).toEqual(200);
            }));
        });

        //To get the id of the test script using test script name, id will be used to delete the script below
        runs(function(){
                      request.get({
                          uri: BASE_URL + '/scripts?name='+script1.name+'&api_key=5150'
                      }, waitsForAsync(function(error, response, body) {
                     var bodyObj = JSON.parse(body);
                   expect(response.statusCode).toEqual(200);
                     console.log("inside REST/SCRIPTS"+response.statusCode);
                           script_id=bodyObj[0]._id;
                          console.log("id of the test script"+bodyObj[0]._id);

                    }));
                 });


        // Clean Up the script
        runs(function(){
            request({
                method: 'delete',
                uri: BASE_URL + "/scripts/" + script_id + "?api_key=5150"
            }, waitsForAsync(function(error, response, body) {
                expect(response.statusCode).toEqual(200);
            }))
        });
    });


});

describe('REST /scripts/:name', function() {
    xit('should not allow you to overwrite a script thorugh a create', function() {
        var obj = {
            name: "zacks_test_script",
            code: "fooo"

        };
        var script_id;
        runs(function(){
            request.post({
                uri: BASE_URL + '/scripts?api_key=5150',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            }, waitsForAsync(function(error,response,body){
                var bodyObj = JSON.parse(body);
                expect(response.statusCode).toEqual(200);
                expect(bodyObj.name).toEqual(obj.name);
                expect(bodyObj.code).toEqual(obj.code);
                 //changing obj.code
                obj.code = 'Updated code';
            }))
        });

        // Now we should make a second request with a different obj code
        // We would expect it not to overwrite it
        runs(function(){
            request.post({
                uri: BASE_URL + '/scripts?api_key=5150',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            }, waitsForAsync(function(error, response, body) {
                bodyObj = JSON.parse(body);
                expect(response.statusCode).not.toEqual(200);
                expect(response.statusCode).toEqual(500);
            }))
        });

          //To get the id of the test script using test script name, id will be used to delete the script below
             runs(function(){
                             request.get({
                                 uri: BASE_URL + '/scripts?name='+obj.name+'&api_key=5150'
                             }, waitsForAsync(function(error, response, body) {
                            var bodyObj = JSON.parse(body);
                          expect(response.statusCode).toEqual(200);
                            console.log("inside REST/SCRIPTS"+response.statusCode);
                                  script_id=bodyObj[0]._id;
                                 console.log("id of the test script"+bodyObj[0]._id);

                           }));
                        });


         // deleting script based on script id
        runs(function(){
            request({
                method: 'delete',
                uri: BASE_URL + "/scripts/" + script_id + "?api_key=5150"
            }, waitsForAsync(function(error, response, body) {
                expect(response.statusCode).toEqual(200);
            }))
        });
    });

});



//PHANTOMJS Tests : fails because port 8081 is hardcoded inside public/agent/lib/iframe-agent.js , so will not work when screening server is on port 8082
//describe('REST /test_results', function() {
//    initServer(PORT);
//
//    it('should execute a test-script against a phantom-js agent and verify the result', function() {
//        var phantomjs = connectPhantomAgent(PORT);
//        var agentId, testId;
//
//        runs(function() {
//            request.get({
//                uri: BASE_URL + "/agents/?api_key=2112"
//            }, waitsForAsync(function(error, response, body) {
//                expect(response.statusCode).toEqual(200);
//                expect(response).toBeTruthy();
//                //console.log("inside - should execute a test-script against a phantom-js agent and verify the result "+body);
//                var retData = JSON.parse(body);
//                agentId = retData[0].id;
//            }));
//        });

//        runs(function() {
//            request.post({
//                uri: BASE_URL + "/agents/" + agentId + "/execute_serialized_code?api_key=2112",
//                body: JSON.stringify({
//                    code:
//                        "var agent = new Agent();" +
//                        "agent.gotoUrl('/screening/control-room/ui-sample.html');" +
//                        "assertEqual(agent.getScroll(), [0,0]);"
//                })
//            }, waitsForAsync(function(error, response, body) {
//                expect(body).toContain("testId");
//                body = JSON.parse(body);
//                testId = body.testId;
//            }));
//        });
//
//        var testResultsAvailable = false;
//
//        waitsFor(function(){
//            // execute the result-fetching until the test-run was completed
//            request.get({
//                uri: BASE_URL + "/test_results/" + testId
//            }, waitsForAsync(function(error, response, body) {
//                body = JSON.parse(body);
//                if(body.status != "RUNNING") {
//                    testResultsAvailable = true;
//                    expect(body.status).toEqual("PASSED");
//                    expect(body.exception).toBeNull();
//                    delete body.asserts[0].time;
//                    expect(body.asserts).toEqual([
//                        {
//                            assertType: 'assertEqual',
//                            expectedValue: [0, 0],
//                            actualValue: [0, 0],
//                            success: true,
//                            lineNumber: 1,
//                            columnNumber: 81
//                        }
//                    ]);
//                }
//                }));
//            return testResultsAvailable;
//        }, "trying to get a test result", 5000);
//
//        runs(function() {
//            phantomjs.kill();
//        });
//    });
//});
