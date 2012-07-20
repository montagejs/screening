#! /bin/bash

clear

echo "Make sure test Mongo db is not running"
MONGO_PID=`ps | grep 27018 | grep mongod | awk '{print $1}'`
if [[ "$MONGO_PID" != "" ]]; then
kill -9 $MONGO_PID
fi

echo "Setting up variables"
BRANCH="origin/master"
MONGO_START="/Users/ntvd76/workspace/mongodb-osx-x86_64-2.0.0 2/bin/mongod"
TEST_DB="/Users/ntvd76/data/test-db"

echo "Getting latest code..."
cd ../..
git fetch
git rebase $BRANCH

echo "Getting latest montage"
git submodule update --init

echo "Getting latest node libraries"
cd server
npm install
cd ..

echo "Starting test db"
"$MONGO_START" --dbpath $TEST_DB --port 27018 &

echo "Executing mocha tests"
cd server
mocha

echo "Killng test Mongo db process"
MONGO_PID=`ps | grep 27018 | grep mongod | awk '{print $1}'`
kill -9 $MONGO_PID