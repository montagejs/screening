<!-- <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> -->

# ScreenResults

This document describes the structure how a testcase 
execution should be reported. It now lists all possible 
reporting fields but it is not required to support all 
of them.

A test result should contain the following information:

* startTime (datetime)
* endTime (datetime)
* testcase:
    * id (can vary)
    * code (testcase source code)
    * name (optional)
    * description (optional)
    * tags (optional)
    * referenceUrl (optional, list of ticket-urls 
      or specifications, ...)
* agents (reference to the agents that were used in the testcase):
    * id
    * type (iframe|webdriver)
    * userAgent (contains browser, os)
    * deviceType (tablet|desktop|phone|...)
    * deviceName
    * ipAddress
* exception (used for element not found, page not loaded in time)
    * message
    * agent
    * lineNumber (optional)
    * fileName (optional)
    * stack (optional)
* asserts
    * assertType (equal|notEqual|contains|notContains|true|
      false|empty|notEmpty|...)
    * actualValue
    * expectedValue
    * message
    * lineNumber
    * fileName
    * success (assert was true / false)
    * time (from the start of the test)


## Questions

* Shall a testcase completly stop after first assert failure?
  We decided that asserts should stop the execution. But we 
  need to figure out a way how to configure it.
* Shall a testcase fail completely when a failure (element not 
  found) occurred?
  We decided that these kind of errors will stop the execution.
