<!-- <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> -->

# REST API WebDriver Tutorial

This is a simple tutorial that will walk you through the process of starting up WebDriver, connecting an agent,
executing a test and finally getting the results.

This tutorial assumes a few things:

* Screening is up and running
* Mac OS X as the Operating System
* For simplicity we'll interact with the REST API using cURL

## WebDriver

First you need to download the ChromeDriver binary for your platform from http://code.google.com/p/chromium/downloads/list

And then execute **chromedriver**, you'll get something like this:

    Started ChromeDriver
    port=9515
    version=14.0.836.0

Now our ChromeDriver is ready to receive commands

## REST API Basics

The Screening REST API is a standards-compliant REST API similar to many others like the ones from Twitter or Facebook.

A RESTful API is based on the concept of Resources and Operations that can be done on them.
It uses the HTTP methods (GET, PUT, POST, DELETE, etc.) and uses JSON as the data representation format,
the HTTP Headers are also important sometimes.

All the REST operations share a base URL, in the case of this tutorial it is:

    http://localhost:8081/screening/api/v1/

Additionally all the operations must include an *API key*, given by the **api_key** URL parameter. Right now the API
keys are not fully implemented and you can use the hardcoded value of 5150

### Additional Resources

* [Wikipedia page for REST](http://en.wikipedia.org/wiki/Representational_state_transfer)
* [The conventions followed for REST URLs](http://microformats.org/wiki/rest/urls)
* [And in-depth example on how to fully use REST the right way](http://martinfowler.com/articles/richardsonMaturityModel.html)

## Connect a WebDriver Agent

In order to execute a test first we need to connect a WebDriver Agent to Screening, that's done by issuing a POST on
/agents/webdriver

    curl -v --noproxy localhost -X POST 'http://localhost:8081/screening/api/v1/agents/webdriver?api_key=5150' -H 'Content-Type:application/json' -d '{"url":"http://localhost:9515"}'

Below is an explanation of the different parts of the request:

* **curl**: The cURL command
* -v: Activate verbose mode (optional but useful if you want to see the full HTTP details)
* --noproxy localhost: (optional, use it only if you have any problems connecting)
* -X POST: Use the POST HTTP method
* 'http://localhost:8081/screening/api/v1/agents/webdriver?api_key=5150': The URL to connect to
* -H 'Content-Type:application/json': Specifies that the content we're sending is formatted as JSON
* -d '{"url":"http://localhost:9515"}': The actual content we're sending as part of the POST request body, it specifies
 the location of the WebDriver server

That will return a response similar to this one:

    {"id":"Grover","capabilities":null,"friendlyName":"Grover","address":null,"isBusy":false,"type":"webdriver"}

Notice the id that was returned (Grover), that will be used to execute a test.

## Execute a test on the agent

Once you have an Agent Id the next step is to POST some code to be executed by that agent.

This method is asynchronous for a good reason: a test execution could take anywhere from a few seconds to several hours,
that's why the method returns a testId that we can use to get the final results.

    curl -v --noproxy localhost -X POST 'http://localhost:8081/screening/api/v1/agents/Grover/execute_serialized_code?api_key=5150&exit_on_failure=false' -H 'Content-Type: application/json; charset=UTF-8' -H "Origin: http://localhost:8081" -d @code.json

Where:

* -X POST: Use the POST HTTP method
* 'http://localhost:8081/screening/api/v1/agents/Grover/execute_serialized_code?api_key=5150&exit_on_failure=false':
  The URL to connect to, notice that after /agents we specify the agent id (Grover in this case)
  exit_on_failure=false means that the test execution will continue even if an assert fails
* -H 'Content-Type: application/json; charset=UTF-8': Specifies that the content we're sending is formatted as JSON
* -H "Origin: http://localhost:8081": **Important** this will be used as the base url for the tests that refer to a
  relative on the server (e.g. agent.gotoUrl("/webapps/calculator/index.html");) if not specified then the resources
  will not be found
* -d @code.json: Take the contents of the file and use them as the POST request body

### code.json

**Note:** The contents of the JSON payload are stored in a file only because of the limitations from the command line and cURL.
You can POST this body directly from your scripts without having to store it in a file.

    {"code":"agent = new Agent();\nagent.gotoUrl(\"/webapps/calculator/index.html\");\n\nagent.element(\"//*[@id='calculator-placeholder-_1']/SPAN\")\n    .mousedown({\"clientX\":196,\"which\":1,\"clientY\":445,\"detail\":1})\n    .mouseup({\"clientX\":196,\"which\":1,\"clientY\":445,\"detail\":1});\nagent.wait(500);\n\nagent.element(\"//*[@id='calculator-placeholder-_plus']\")\n    .mousedown({\"clientX\":515,\"which\":1,\"clientY\":533,\"detail\":1})\n    .mouseup({\"clientX\":515,\"which\":1,\"clientY\":533,\"detail\":1});\nagent.wait(500);\n\nagent.element(\"//*[@id='calculator-placeholder-_1']/SPAN\")\n    .mousedown({\"clientX\":194,\"which\":1,\"clientY\":441,\"detail\":1})\n    .mouseup({\"clientX\":194,\"which\":1,\"clientY\":441,\"detail\":1});\n\n\nagent.element(\"//*[@id='calculator-placeholder-_equal']\")\n    .mousedown({\"clientX\":520,\"which\":1,\"clientY\":687,\"detail\":1})\n    .mouseup({\"clientX\":520,\"which\":1,\"clientY\":687,\"detail\":1});\n\nagent.wait(1000);\n\nvar value = agent.element(\"#currentEntry\").getText();\nassertEqual(\"2\", value);\nassertEqual(\"Super Calculator\",agent.getTitle())","name":"Hello World"}

The response is similar to the following:

    {"testId":"6646826f-e51e-4b15-a64b-da7243e4d0c7"}

Keep the returned testId because it will be used to retrieve the results.

## Get results

Using the testId you can poll the REST API to see if the test execution is complete and get the results.

    curl -v --noproxy localhost -X GET 'http://localhost:8081/screening/api/v1/test_results/6646826f-e51e-4b15-a64b-da7243e4d0c7?api_key=5150'

Where:

* -X GET: Use the GET HTTP method
* 'http://localhost:8081/screening/api/v1/test_results/6646826f-e51e-4b15-a64b-da7243e4d0c7?api_key=5150': The URL to
  get the test results, the part after /test_results/ is the testId that we got on the previous step

The response is similar to the following (formatted for better legibility):

     {
        "startTime": "2011-09-07T23:58:36.393Z",
        "name": "Undefined",
        "endTime": "2011-09-07T23:58:40.166Z",
        "testcase": {
            "id": "04290afe-f6d4-45e6-a5f6-5ab7e572ab55",
            "code": "agent = new Agent();\nagent.gotoUrl(\"/webapps/calculator/index.html\");\n\nagent.element(\"//*[@id='calculator-placeholder-_1']/SPAN\")\n .mousedown({\"clientX\":196,\"which\":1,\"clientY\":445,\"detail\":1})\n .mouseup({\"clientX\":196,\"which\":1,\"clientY\":445,\"detail\":1});\nagent.wait(500);\n\nagent.element(\"//*[@id='calculator-placeholder-_plus']\")\n .mousedown({\"clientX\":515,\"which\":1,\"clientY\":533,\"detail\":1})\n .mouseup({\"clientX\":515,\"which\":1,\"clientY\":533,\"detail\":1});\nagent.wait(500);\n\nagent.element(\"//*[@id='calculator-placeholder-_1']/SPAN\")\n .mousedown({\"clientX\":194,\"which\":1,\"clientY\":441,\"detail\":1})\n .mouseup({\"clientX\":194,\"which\":1,\"clientY\":441,\"detail\":1});\n\n\nagent.element(\"//*[@id='calculator-placeholder-_equal']\")\n .mousedown({\"clientX\":520,\"which\":1,\"clientY\":687,\"detail\":1})\n .mouseup({\"clientX\":520,\"which\":1,\"clientY\":687,\"detail\":1});\n\nagent.wait(1000);\n\nvar value = agent.element(\"#currentEntry\").getText();\nassertEqual(\"2\", value);\nassertEqual(\"Super Calculator\",agent.getTitle())",
            "name": "Hello World"
        },
        "exception": null,
        "asserts": [
            {
                "assertType": "assertEqual",
                "success": true,
                "time": 3562,
                "lineNumber": 26,
                "columnNumber": 1,
                "expectedValue": "2",
                "actualValue": "2"
            },
            {
                "assertType": "assertEqual",
                "success": false,
                "time": 3572,
                "lineNumber": 27,
                "columnNumber": 1,
                "expectedValue": "Super Calculator",
                "actualValue": "Calculator"
            }
        ],
        "agent": "Grover",
        "status": "FAILED"
    }

Where:

* startTime, endTime: The timestamp when the test was started/ended
* name: A friendly name given to this test run, can be ignored for now
* testcase: Metadata for this testcase, like it's id, the code that was executed and the script name
* exception: If there were no exceptions while running the test this will be null, otherwise this will be a string
  with the stack trace
* asserts: an array of assert objects
    * assertType: The assert method
    * success: was the assert successful? true/false
    * time: number of miliseconds elapse since the start of the test
    * lineNumber/columnNumber: the line/column number where this assert is located in the test script
    * expectedValue/actualValue: if the actual value is different from the expected value then this assert if considered
      a failure
* agent: The agent where this test script was run
* status: The overall status of the test script results, it could have the following values:
    * RUNNING: A non-final status, the test is still being executed, keep polling until you get any of the other statuses
    * PASSED: All the asserts passed and there were no exceptions
    * FAILED: There was at least one assert that failed
    * EXCEPTION: There was a system exception that prevented this test from completing
      (page not found, syntax errors in the script, etc.)

**Note**: Since the test executes asynchronously you might need to poll the server multiple times to get a final status
(PASSED, FAILED, EXCEPTION).

## Conclusion

Please send any questions to the author of this document: eliseo.soto@motorola.com
