<!-- <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> -->

# agents

## GET /agents/

GET http://localhost:8081/screening/api/v1/agents

### Response

    HTTP/1.1 200 OK

#### Headers

    Content-Type: application/json; charset=utf-8

#### Body

    [
      {
        "address": {
          "address": "127.0.0.1", 
          "port": 53271
        }, 
        "capabilities": {
          "launchBrowser": false, 
          "screen": {
            "availHeight": 1050, 
            "availLeft": -1680, 
            "availTop": 0, 
            "availWidth": 1680, 
            "colorDepth": 24, 
            "height": 1050, 
            "pixelDepth": 24, 
            "width": 1680
          }, 
          "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_1) AppleWebKit/535.2 (KHTML, like Gecko) Chrome/15.0.866.0 Safari/535.2"
        }, 
        "friendlyName": "Bean", 
        "id": "839331985502054012", 
        "isBusy": false, 
        "type": "iframe"
      }, 
      {
        "address": {
          "address": "127.0.0.1", 
          "port": 53271
        }, 
        "capabilities": {
          "launchBrowser": false, 
          "screen": {
            "availHeight": 1050, 
            "availLeft": -1680, 
            "availTop": 0, 
            "availWidth": 1680, 
            "colorDepth": 24, 
            "height": 1050, 
            "pixelDepth": 24, 
            "width": 1680
          }, 
          "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_1) AppleWebKit/535.2 (KHTML, like Gecko) Chrome/15.0.866.0 Safari/535.2"
        }, 
        "friendlyName": "Rowlf", 
        "id": "4823880811082569637", 
        "isBusy": false, 
        "type": "iframe"
      }
    ]

--------------------

## GET /agents/:id

GET http://localhost:8081/screening/api/v1/agents/4823880811082569637

### Response

    HTTP/1.1 200 OK

#### Headers
    Content-Type: application/json; charset=utf-8

#### Body

    {
      "address": {
        "address": "127.0.0.1",
        "port": 53271
      },
      "capabilities": {
        "launchBrowser": false,
        "screen": {
          "availHeight": 1050,
          "availLeft": -1680,
          "availTop": 0,
          "availWidth": 1680,
          "colorDepth": 24,
          "height": 1050,
          "pixelDepth": 24,
          "width": 1680
        },
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_1) AppleWebKit/535.2 (KHTML, like Gecko) Chrome/15.0.866.0 Safari/535.2"
      },
      "friendlyName": "Rowlf",
      "id": "4823880811082569637",
      "isBusy": false,
      "type": "iframe"
    }

--------------------

## DELETE /agents/:id

DELETE http://localhost:8081/screening/api/v1/agents/11099235871214500237

### Response

HTTP/1.1 200 OK

#### Headers

    Content-Type: application/json; charset=utf-8
    
#### Body

    
    {
      "address": {
        "address": "127.0.0.1", 
        "port": 58017
      }, 
      "capabilities": {
        "launchBrowser": false, 
        "screen": {
          "availHeight": 1050, 
          "availLeft": -1680, 
          "availTop": 0, 
          "availWidth": 1680, 
          "colorDepth": 24, 
          "height": 1050, 
          "pixelDepth": 24, 
          "width": 1680
        }, 
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_1) AppleWebKit/535.2 (KHTML, like Gecko) Chrome/15.0.866.0 Safari/535.2"
      }, 
      "friendlyName": "Animal", 
      "id": "11099235871214500237", 
      "isBusy": false, 
      "type": "iframe"
    }

--------------------

## GET /agents/:id/tests/:test/run

**DEPRECATED!!! Replaced by /agents/:id/execute_serialized_code**

--------------------

## POST /agents/:id/execute_serialized_code

POST http://localhost:8081/screening/api/v1/agents/11099235871214500237/execute_serialized_code?api_key=5150&exit_on_failure=false

### Request

#### Headers

    Content-Type:application/json; charset=UTF-8

#### Body

    {
      "code": "var agent = new Agent();\nagent.gotoUrl(\"/screening/control-room/ui-sample.html\");\n\n//TODO agent.getUrl().assertContains(\"/screening/control-room/ui-sample.html\");\n\nvar inputNode = agent.element(\"//*[@id='testInput']\");\n\n// getText().\ninputNode.keyPresses(\"ABC\");\nassertEqual(\"ABC\", inputNode.getText());\n\n// getSource()\nvar src = null;\nassertNotEmpty(agent.getSource());\n//agent.getSource().assertContains(\"ABC\"); i dont know yet how to get the current source, not the one loaded.\nassertNotContains(\"Microsoft IE6\", agent.getSource());\nassertStartsWith(\"<head>\", agent.getSource());\nassertEndsWith(\"</\"+\"body>\", agent.getSource());\n\n\n// getTitle()\nassertEqual(\"Simple UI Sample\", agent.getTitle());\nassertNotEqual(\"Complex\", agent.getTitle());\n\n// setScrollTo()\nagent.setScrollTo(0,2);\nassertEqual([0,2], agent.getScroll());\n\n// setScrollBy()\nagent.setScrollBy(0,2);\nassertEqual([0,4], agent.getScroll());\n\n// getScroll()\nassertEqual([0,4], agent.getScroll());\n\n//*/ //Leave this in here, to test that if the last line is a comment the execution works anyways. (regression testing)",
      "name": "test-core-functions.js"
    }

### Response

    HTTP/1.1 201 Created

#### Headers

    Content-Type: application/json; charset=utf-8

#### Body

    {"testId":"c0a64c81-378e-4647-9552-c6f1dcec7cb2"}

--------------------

## POST /agents/:id/recording

POST http://localhost:8081/screening/api/v1/agents/11099235871214500237/recording?api_key=5150

### Request

#### Headers

    Content-Type:text/plain

#### Body

    /screening/sample.html
    
### Response

    HTTP/1.1 201 Created

#### Headers

    Content-Type:text/plain
    
#### Body

    OK

--------------------

## DELETE /agents/:id/recording

http://localhost:8081/screening/api/v1/agents/11099235871214500237/recording?api_key=5150

### Response

    HTTP/1.1 200 OK

#### Headers

    Content-Type:application/javascript
    
#### Body

    // ==== Start Recorded Script, Tue Aug 30 2011 16:55:28 GMT-0700 (PDT)==== 

    var agent = new Agent();
    
    agent.gotoUrl("/screening/sample.html");

    agent.element("//*[@id='textField']").dispatchEvent("focus");
    agent.wait(278);

    // More and more code

    // ==== End Recorded Script ====
    
--------------------

## PUT /agents/:id/recording/pause?

http://localhost:8081/screening/api/v1/agents/11099235871214500237/recording/pause?api_key=5150

### Response

    HTTP/1.1 202 Accepted

#### Headers

    Content-Type:application/javascript
    
#### Body

    // ==== Start Recorded Script, Tue Aug 30 2011 16:55:13 GMT-0700 (PDT)==== 

    var agent = new Agent();

    agent.gotoUrl("/screening/sample.html");

    // ==== End Recorded Script ====

--------------------

## PUT /agents/:id/recording/resume?

http://localhost:8081/screening/api/v1/agents/11099235871214500237/recording/resume?api_key=5150

### Response

    HTTP/1.1 202 Accepted
    
#### Headers

    Content-Type:text/plain
    
#### Body

    OK

--------------------

## POST /agents/webdriver

http://localhost:8081/screening/api/v1/agents/webdriver?api_key=5150

### Request

#### Headers

    Content-Type:application/json

#### Body

    {"url":"http://localhost:9515"}

### Response

    HTTP/1.1 201 Created

#### Headers

    Content-Type:application/json; charset=utf-8

#### Body

    {
      "address": null,
      "capabilities": null,
      "friendlyName": "George",
      "id": "George",
      "isBusy": false,
      "type": "webdriver"
    }

#scripts

## GET /scripts/

Gets all the scripts stored in the Screening Server

http://localhost:8081/screening/api/v1/scripts?api_key=5150

### Response

    HTTP/1.1 200 OK

#### Headers

    Content-Type:application/json; charset=utf-8

#### Body

    [
      {
        "_id": "4e8a4e2373090afa25000001",
        "code": "var greeting = \"Hello\"",
        "modified": "2011-10-07T00:53:52.075Z",
        "name": "other script.js",
        "size": 3,
        "tags": [
          "other"
        ]
      },
      {
        "_id": "4e8a329f437e61480a000001",
        "code": "var agent = new Agent();\nagent.gotoUrl(\"/webapps/calculator/index.html\");\n\nagent.wait(500); \n \nagent.element(\"#calculator-placeholder-_1\").mouseClick();\nagent.wait(10000);",
        "modified": "2011-10-11T22:18:55.845Z",
        "name": "second-script.js",
        "size": 174,
        "tags": [
          "firefox",
          "two words",
          "firefox mobile",
          "other"
        ]
      }
    ]

## GET /scripts?name=:scriptName

Gets the script with the name :scriptName

The result is a JSON array containing zero or one elements.

http://localhost:8081/screening/api/v1/scripts?name=other%20script.js&api_key=5150

**NOTE**: Don't forget to properly URL encode the parameters, in this case 'other script.js' must be escaped to 'other%20script.js'

### Response

    HTTP/1.1 200 OK

#### Headers

    Content-Type:application/json; charset=utf-8

#### Body

    [
      {
        "_id": "4e8a4e2373090afa25000001",
        "code": "var greeting = \"Hello\"",
        "modified": "2011-10-07T00:53:52.075Z",
        "name": "other script.js",
        "size": 3,
        "tags": [
          "other"
        ]
      }
    ]

## GET /scripts?name_search=:partialScriptName

Gets all the scripts that partially match partialScriptName.

The result is a JSON array containing zero or more elements.

http://localhost:8081/screening/api/v1/scripts?api_key=5150&name_search=st

### Response

    HTTP/1.1 200 OK

#### Headers

    Content-Type:application/json; charset=utf-8

#### Body

**NOTE:** Only the name property is shown here for brevity but the actual results contain all the properties, notice that it matches fir**st**-script.js and object-name-te**st**-results.js

    [
      {
        "name": "first-script.js",
      },
      {
        "name": "object-name-test-results.js",
      }
    ]

## GET /scripts?tags=:scriptTags

Gets the scripts tagged with ALL the tags specified.

http://localhost:8081/screening/api/v1/scripts?tags=other,firefox%20mobile&api_key=5150

Note that even though we have two scripts with the tag "other" there's only one script that both contains the tags "other" and "firefox mobile".

### Response

    HTTP/1.1 200 OK

#### Headers

    Content-Type:application/json; charset=utf-8

#### Body

    [
      {
        "_id": "4e8a329f437e61480a000001",
        "code": "var agent = new Agent();\nagent.gotoUrl(\"/webapps/calculator/index.html\");\n\nagent.wait(500); \n \nagent.element(\"#calculator-placeholder-_1\").mouseClick();\nagent.wait(10000);",
        "modified": "2011-10-11T22:18:55.845Z",
        "name": "second-script.js",
        "size": 174,
        "tags": [
          "firefox",
          "two words",
          "firefox mobile",
          "other"
        ]
      }
    ]

## GET /scripts/archive

GETs an archive (ZIP) of all the scripts found in the server.

http://localhost:8081/screening/api/v1/scripts/archive?api_key=5150

### Response

    HTTP/1.1 200 OK

#### Headers

    Content-Type: application/zip

#### Body

    {binary data in ZIP format}

## GET /scripts/:id

GET a script by its id.

http://localhost:8081/screening/api/v1/scripts/4e8a329f437e61480a000001?api_key=5150

### Response

    HTTP/1.1 200 OK

#### Headers

    Content-Type: application/json; charset=utf-8

#### Body

    {
      "_id": "4e8a329f437e61480a000001",
      "code": "var agent = new Agent();\nagent.gotoUrl(\"/webapps/calculator/index.html\");\n\nagent.wait(500);   \n  \nagent.element(\"#calculator-placeholder-_1\").mouseClick();\nagent.wait(10000);",
      "modified": "2011-10-12T22:43:14.853Z",
      "name": "second-script.js",
      "size": 174,
      "tags": [
        "firefox",
        "two words",
        "firefox mobile",
        "other"
      ]
    }

## GET /scripts/:id/download

Downloads the specified script, it will simply spit out the contents of the file as plain text.

http://localhost:8081/screening/api/v1/scripts/4e8a329f437e61480a000001/download?api_key=5150

### Response

    HTTP/1.1 200 OK

#### Headers

    Content-Type: text/plain

#### Body

    var agent = new Agent();
    agent.gotoUrl("/webapps/calculator/index.html");

    agent.wait(500);

    agent.element("#calculator-placeholder-_1").mouseClick();
    agent.wait(10000);

## POST /scripts/

Creates a new script, it requires a JSON object in the Request Body in the following format:

{"name": "My Script Name", "code": "The script contents"}

http://localhost:8081/screening/api/v1/scripts?api_key=5150

### Request

#### Headers

    Content-Type: application/json; charset=utf-8

#### Body

    {"name": "My Script Name", "code": "The script contents"}

### Response

    HTTP/1.1 200 OK

#### Headers

    Content-Type: application/json; charset=utf-8

#### Body

    {"_id":"4e962a7edef0af970f000002","code":"The script contents","modified":"2011-10-13T00:02:06.079Z","name":"My Script Name","size":19}

## PUT /scripts/:id

Updates the specified script, all the properties are replaced with the ones provided.

{"name": "new-name.js} // Changes the name to new-name.js but the code remains the same

{"name": "My Script Name", "code": "The code will be replaced with this"} // Modifies only code, note that name must always be provided

http://localhost:8081/screening/api/v1/scripts/4e962a7edef0af970f000002?api_key=5150

### Request

#### Headers

    Content-Type: application/json; charset=utf-8

#### Body

    {"name": "new-name.js"}

### Response

    HTTP/1.1 200 OK

#### Headers

    Content-Type: application/json; charset=utf-8

#### Body

    {
      "_id": "4e962a7edef0af970f000002",
      "code": "The script contents",
      "modified": "2011-10-13T00:15:12.749Z",
      "name": "new-name.js",
      "size": 19
    }

## DELETE /scripts/:id

Deletes the specified script

http://localhost:8081/screening/api/v1/scripts/4e962a7edef0af970f000002?api_key=5150

### Response

#### Headers

    HTTP/1.1 200 OK

#### Body

    {"deleted":true}

# test_results

## GET /test_results

GETs all the available test results.

http://localhost:8081/screening/api/v1/test_results?api_key=5150

### Response

    HTTP/1.1 200 OK

#### Headers

    Content-Type: application/json; charset=utf-8

#### Body

Too verbose to post here but will be something like this:

    [
      {
        "_id": "4e7bd105fb02a6181a000002",
        "_lastAssertResult": true,
        "agent": "Sweetums",
        "asserts": [
          {
            "actualValue": "ABC",
            "assertType": "assertEqual",
            "columnNumber": 1,
            "expectedValue": "ABC",
            "fileName": "test-core-functions.js",
            "lineNumber": 12,
            "message": null,
            "stackTrace": [
              {
                "columnNumber": 1,
                "fileName": "testscript.vm",
                "lineNumber": 12
              }
            ],
            "success": true,
            "time": 1082
          },
          {
            "actualValue": "This is the actual value",
            "assertType": "assertNotEmpty",
            "columnNumber": 1,
            "expectedValue": "<notempty>",
            "fileName": "test-core-functions.js",
            "lineNumber": 16,
            "message": null,
            "stackTrace": [
              {
                "columnNumber": 1,
                "fileName": "testscript.vm",
                "lineNumber": 16
              }
            ],
            "success": true,
            "time": 1085
          },
          {
            "actualValue": "Chrome 17",
            "assertType": "assertNotContains",
            "columnNumber": 1,
            "expectedValue": "Microsoft IE6",
            "fileName": "test-core-functions.js",
            "lineNumber": 18,
            "message": null,
            "stackTrace": [
              {
                "columnNumber": 1,
                "fileName": "testscript.vm",
                "lineNumber": 18
              }
            ],
            "success": true,
            "time": 1088
          },
          {
            "actualValue": "<!DOCTYPE html><html>Blah</html>",
            "assertType": "assertStartsWith",
            "columnNumber": 1,
            "expectedValue": "<!DOCTYPE html>",
            "fileName": "test-core-functions.js",
            "lineNumber": 19,
            "message": null,
            "stackTrace": [
              {
                "columnNumber": 1,
                "fileName": "testscript.vm",
                "lineNumber": 19
              }
            ],
            "success": true,
            "time": 1091
          },
          {
            "actualValue": "<!DOCTYPE html><html>Blah</html>",
            "assertType": "assertEndsWith",
            "columnNumber": 1,
            "expectedValue": "</html>",
            "fileName": "test-core-functions.js",
            "lineNumber": 20,
            "message": null,
            "stackTrace": [
              {
                "columnNumber": 1,
                "fileName": "testscript.vm",
                "lineNumber": 20
              }
            ],
            "success": true,
            "time": 1096
          },
          {
            "actualValue": "Simple UI Sample",
            "assertType": "assertEqual",
            "columnNumber": 1,
            "expectedValue": "Simple UI Sample",
            "fileName": "test-core-functions.js",
            "lineNumber": 24,
            "message": null,
            "stackTrace": [
              {
                "columnNumber": 1,
                "fileName": "testscript.vm",
                "lineNumber": 24
              }
            ],
            "success": true,
            "time": 1098
          },
          {
            "actualValue": "Simple UI Sample",
            "assertType": "assertNotEqual",
            "columnNumber": 1,
            "expectedValue": "Complex",
            "fileName": "test-core-functions.js",
            "lineNumber": 25,
            "message": null,
            "stackTrace": [
              {
                "columnNumber": 1,
                "fileName": "testscript.vm",
                "lineNumber": 25
              }
            ],
            "success": true,
            "time": 1100
          },
          {
            "actualValue": [
              0,
              2
            ],
            "assertType": "assertEqual",
            "columnNumber": 1,
            "expectedValue": [
              0,
              2
            ],
            "fileName": "test-core-functions.js",
            "lineNumber": 29,
            "message": null,
            "stackTrace": [
              {
                "columnNumber": 1,
                "fileName": "testscript.vm",
                "lineNumber": 29
              }
            ],
            "success": true,
            "time": 1103
          },
          {
            "actualValue": [
              0,
              4
            ],
            "assertType": "assertEqual",
            "columnNumber": 1,
            "expectedValue": [
              0,
              4
            ],
            "fileName": "test-core-functions.js",
            "lineNumber": 33,
            "message": null,
            "stackTrace": [
              {
                "columnNumber": 1,
                "fileName": "testscript.vm",
                "lineNumber": 33
              }
            ],
            "success": true,
            "time": 1107
          },
          {
            "actualValue": [
              0,
              4
            ],
            "assertType": "assertEqual",
            "columnNumber": 1,
            "expectedValue": [
              0,
              4
            ],
            "fileName": "test-core-functions.js",
            "lineNumber": 36,
            "message": null,
            "stackTrace": [
              {
                "columnNumber": 1,
                "fileName": "testscript.vm",
                "lineNumber": 36
              }
            ],
            "success": true,
            "time": 1108
          }
        ],
        "endTime": "2011-09-23T00:21:26.369Z",
        "exception": null,
        "name": "Undefined",
        "startTime": "2011-09-23T00:21:25.261Z",
        "status": "PASSED",
        "testcase": {
          "code": "// This is the code used in this test, it's ommited on this document because it's too long.",
          "name": "test-core-functions.js"
        }
      }
    ]

## GET /test_results?status=:resultStatus

GETs all the available test results that match the give status.

:resultStatus could be any of RUNNING, PASSED, FAILED or EXCEPTION

http://localhost:8081/screening/api/v1/test_results?status=RUNNING&api_key=5150

### Response

    HTTP/1.1 200 OK

#### Headers

    Content-Type: application/json; charset=utf-8

#### Body

    []

## GET /test_results?startTimeAfter=:ISO8601Date&startTimeBefore=:ISO8601Date&api_key=5150

GETs all the available results which startDate is in the date ranges specified

The dates must be expressed in the [ISO 8601 format](http://en.wikipedia.org/wiki/ISO_8601)

http://localhost:8081/screening/api/v1/test_results?startTimeAfter=2011-10-01T00:00:00.0Z&startTimeBefore=2011-10-10T00:00:00.0Z

### Response

    HTTP/1.1 200 OK

#### Headers

    Content-Type: application/json; charset=utf-8

#### Body


    [
      {
        "_id": "4e8e1c87274e5f1406000001",
        "_lastAssertResult": null,
        "agent": "Fozzie",
        "asserts": [],
        "endTime": "2011-10-06T21:24:23.245Z",
        "exception": null,
        "name": "Undefined",
        "startTime": "2011-10-06T21:24:23.208Z",
        "status": "PASSED",
        "testcase": {
          "code": "   ",
          "name": "second"
        }
      }
    ]

## GET /test_results?any=:searchString&api_key=5150

GETs all the available results where name, agent or testcase.name (partially) match the :searchString

http://localhost:8081/screening/api/v1/test_results?any=zz&api_key=5150

### Response

    HTTP/1.1 200 OK

#### Headers

    Content-Type: application/json; charset=utf-8

#### Body

In this case agent (Fozzie) contains the search string (zz)

    [
      {
        "_id": "4e8e1c87274e5f1406000001",
        "_lastAssertResult": null,
        "agent": "Fozzie",
        "asserts": [],
        "endTime": "2011-10-06T21:24:23.245Z",
        "exception": null,
        "name": "Undefined",
        "startTime": "2011-10-06T21:24:23.208Z",
        "status": "PASSED",
        "testcase": {
          "code": "   ",
          "name": "second"
        }
      }
    ]

## GET /test_results/metadata?api_key=5150

GETs metadata about the testcases.
Metadata includes:

* count: Total testcases in the database

### Response

    HTTP/1.1 200 OK

#### Headers

    Content-Type: application/json; charset=utf-8

#### Body

    {
      "count": 38
    }

## GET /test_results/:id?api_key=5150

GETs an individual test result by its id.

http://localhost:8081/screening/api/v1/test_results/4e94c80e1203c2a22d000001?api_key=5150

### Response

    HTTP/1.1 200 OK

#### Headers

    Content-Type: application/json; charset=utf-8

#### Body

    {
      "_id": "4e94c80e1203c2a22d000001",
      "_lastAssertResult": null,
      "agent": "Ernie",
      "asserts": [],
      "endTime": "2011-10-11T22:50:02.582Z",
      "exception": null,
      "name": "Undefined",
      "startTime": "2011-10-11T22:49:50.476Z",
      "status": "PASSED",
      "testcase": {
        "code": "var agent = new Agent();\nagent.gotoUrl(\"/webapps/calculator/index.html\");\n\nagent.wait(500);   \n  \nagent.element(\"#calculator-placeholder-_1\").mouseClick();\nagent.wait(10000);",
        "name": "second"
      }
    }

## PUT /test_results/:id?api_key=5150

Updates an invidual test result by its id.

The request body must contain the properties to update. This example updates the "name" property.

http://localhost:8081/screening/api/v1/test_results/4e7bd105fb02a6181a000002?api_key=5150

### Request

#### Headers

    Content-Type: application/json; charset=utf-8

#### Body

    {"name": "A cool new name"}

### Response

    HTTP/1.1 200 OK

#### Headers

    Content-Type: application/json; charset=utf-8

#### Body

    {
      "_id": "4e94c80e1203c2a22d000001",
      "_lastAssertResult": null,
      "agent": "Ernie",
      "asserts": [],
      "endTime": "2011-10-11T22:50:02.582Z",
      "exception": null,
      "name": "A cool new name",
      "startTime": "2011-10-11T22:49:50.476Z",
      "status": "PASSED",
      "testcase": {
        "code": "var agent = new Agent();\nagent.gotoUrl(\"/webapps/calculator/index.html\");\n\nagent.wait(500);   \n  \nagent.element(\"#calculator-placeholder-_1\").mouseClick();\nagent.wait(10000);",
        "name": "second"
      }
    }

## DELETE /test_results/multiple?api_key

Deletes multiple test results based on the body sent.

The body must be in the following format:

{"ids": ["id1", "id2", "id3"]} // where idN is the id to be deleted

http://localhost:8081/screening/api/v1/test_results/multiple?api_key=5150

### Request

#### Headers

    Content-Type: application/json; charset=utf-8

#### Body

    {"ids": ["4e973071588a567d02000001"]}

### Response

    HTTP/1.1 200 OK

#### Headers

    Content-Type: application/json; charset=utf-8

#### Body

    {"ok": true}
