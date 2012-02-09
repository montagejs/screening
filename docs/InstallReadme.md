<!-- <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> -->

# Screening

Screening is a testing tool for Montaged-based applications.

It runs as a Node.js web application and creates its own server.

## Requirements

Screening has a few requirements which must be met before you are able to install and use it.

* Node.js - A JavaScript environment where the Screening server runs.
* npm - The package manager for Node.js that is run through the command line and manages dependencies for an application.
* MongoDB - The database used by the Screening server to store test scripts and results.

## Installation

The installation process varies slightly depending on the platform. As of now Screening only supports Ubuntu Linux and Mac OS X.

The installation producedure for node and npm is different for Mac and Ubuntu Linux.

### Install node and npm on Mac

The easiest way is to download a package that includes both node and npm at:

    https://sites.google.com/site/nodejsmacosx/

Download version 0.4.x (stable)

### Install node on Ubuntu Linux

Open the Terminal and enter the following commands one at a time:

    sudo apt-get update
    sudo apt-get install git-core curl build-essential openssl libssl-dev
    git clone https://github.com/joyent/node.git && cd node
    git checkout v0.4.12
    ./configure
    make
    sudo make install

Then verify that the installation completed successfully by printing out the node version:

    node -v

### Install npm on Ubuntu Linux

The installation is just a single command:

    curl http://npmjs.org/install.sh | sudo sh

Then verify that the installation was completed successfully by printing out the npm version:

    npm -v

## Install Screening

Screening comes distributed as a tarball. You can uncompress it in the location of your choice by using a GUI or the
command line.

    tar -xzvf

When uncompressed, it creates a structure similar to this:

    `SCREENING_HOME`
        ├── common
        ├── docs
        ├── public
        ├── server
        └── test

We'll refer to the base directory as `SCREENING_HOME` from now on.

### Install dependencies

Use npm to install the Screening dependencies:

From `SCREENING_HOME`:

    cd server
    npm install

This will download all the libraries used by Screening into: `SCREENING_HOME`/server/node_modules.

The Montage submodule also needs to initialized. From `SCREENING_HOME`:

    git submodule update --init

### Download and install MongoDB

MongoDB can be downloaded from http://www.mongodb.org/downloads. Screening has been tested with version 2.0.
Please use the 64-bit version if your system supports it.

Note: On OSX if you use the [Homebrew](http://mxcl.github.com/homebrew/) package manager you
can install mongodb with `brew install mongodb`. `mongod` will then be available directly
on your path. To install a specific version use `brew versions mongodb`.

However it's also possible to download it automatically with the following command:

From `SCREENING_HOME`:

    cd server
    npm run-script install-mongodb

If the installation successfully completes, MongoDB will be located in a location similar to the following (it varies
depending on the platform):

    ~/mongodb-osx-x86_64-2.0.1

We'll refer to this as `MONGO_HOME`.

## Startup Screening

### Startup the MongoDB server

Important note: The MongoDB server must be started before the Screening server.

Make sure that a directory called ~/data/db exists. This is created by the previous step, and if not then create it.

From `MONGO_HOME`:

    ./bin/mongod --dbpath ~/data/db/

This will start MongoDB on the standard port (27017).

### Startup the Screening Server

From `SCREENING_HOME`:

    cd server
    npm start

The output from the last command should look like this:

    > screening@0.1.6 start /Users/BNH378/Documents/code/node/screening/server
    > node index.js

    [webdriver] express app was mounted.
    [agents] express app was mounted.
    [scripts] express app was mounted.
    [test_results] express app was mounted.
       info  - socket.io started
    Screening Server running on port 8081 [development]
    Connected to MongoDB server on localhost:27017, database: screening

Verify that the server was started up correctly by navigating to the Control Room at:

    http://localhost:8081/screening/control-room/index.html

Proceed to the first section of [REST API WebDriver Tutorial](RestApiWebDriverTutorial.md) to set up
a driver.

