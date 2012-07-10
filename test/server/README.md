<!-- <copyright>
Copyright (c) 2012, Motorola Mobility LLC.
All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of Motorola Mobility LLC nor the names of its
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
</copyright> -->
Prerequisites for running the server tests
===================================

Installing jasmine-node
-----------------------

The tests are written using **jasmine** and **jasmine-node**
and for running the tests we have to install jasmine-node:

    npm install -g jasmine-node # install it global
    cd SCREENING_HOME
	jasmine-node test/server/ --verbose

Installing PhantomJS
--------------------

1. Go to http://code.google.com/p/phantomjs/downloads/list and download a binary distribution (e.g. phantomjs-1.2.0-macosx-universal.dmg)
2. Double click the .dmg
3. Drag phantomjs.app to your Applications directory
4. Verify the installation by opening a Terminal and typing, that should return the version number with no errors

>>> /Applications/phantomjs.app/Contents/MacOS/phantomjs --version
1.2.0 (development)



Adding new tests
-----------------

For new tests we just have to add new spec-files that end 
with '*spec.js'.
