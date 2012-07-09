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
