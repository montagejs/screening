<!-- <copyright>
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
