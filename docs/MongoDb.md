<!-- <copyright>
 This file contains proprietary software owned by Motorola Mobility, Inc.<br/>
 No rights, expressed or implied, whatsoever to this software are provided by Motorola Mobility, Inc. hereunder.<br/>
 (c) Copyright 2011 Motorola Mobility, Inc.  All Rights Reserved.
 </copyright> -->
 
# MongoDB in Screening

MongoDB is used to persist test scripts and test results.

Screening will not start up if a MongoDB server is not up and running.

## Installation

1. Download MongoDB 2.0.0 for your platform from:

    [MongoDB Downloads](http://www.mongodb.org/downloads)

    **Note**: Make sure to download the 64-bit version.

2. Uncompress the archive into it's own directory (~/Applications/mongodb-osx-x86_64-2.0.0 will be used for this example)

3. Create the ~/data/db/ directory, this is where the database files will be stored

        mkdir -p ~/data/db/

## Running

The installation process is only done once, afterwards you can start up MongoDB with the following command:

        ~/Applications/mongodb-osx-x86_64-2.0.0/bin/mongod --dbpath ~/data/db/

That starts up MongoDB in the default port (27017)

## MongoDB Shell

This is *not* required in order to run screening but if you're an advanced user and would like to interact directly
with the DB then the shell is started with this command:

    ~/Applications/mongodb-osx-x86_64-2.0.0/bin/mongo

It automatically connects to localhost:27017
