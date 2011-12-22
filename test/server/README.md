<!-- <copyright>
  This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
  No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
  (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
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
