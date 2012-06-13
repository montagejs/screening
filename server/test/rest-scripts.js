var request = require("request"),
    testUtils = require("./test-utils"),
    assert = require("assert");
const BASE_URL = testUtils.BASE_URL;

describe("REST Scripts", function() {
    before(function(done) {
        testUtils.startServer();
        setTimeout(done, 500);
    });

    beforeEach(function(done) {
        testUtils.clearDatabase(done);
    });

    after(function(done) {
        testUtils.stopServer();
        done();
    });

    it("Gets all the Scripts", function(done) {
        request.get({
            uri: BASE_URL + '/scripts?api_key=2112'
        }, function(error, response, body) {
            response.should.be.json;
            var bodyObj = JSON.parse(body);
            response.statusCode.should.equal(200);
            bodyObj.should.be.array;
            done();
        });
    });

    it("should allow you to create a new script", function(done) {
        var script1 = {
            "code": "123_awesome",
            "name": "awesomeScript_22"
        };
        var script_id;
        var json_script1 = JSON.stringify(script1);

        request.post({
            uri: BASE_URL + '/scripts/?api_key=5150',
            headers: {
                "Content-Type": "application/json"
            },
            body: json_script1
        }, function(error, response, body) {
            response.should.be.json;
            var bodyObj = JSON.parse(body);
            response.statusCode.should.equal(200);
            bodyObj.name.should.equal(script1.name);
            bodyObj.code.should.equal(script1.code);

            done();
        });
    });

    it("verifies that we get 3 scripts", function(done) {
        var scripts = [
            {
                "code": "123_awesome",
                "name": "awesomeScript_1"
            },
            {
                "code": "123_awesome",
                "name": "awesomeScript_2"
            },
            {
                "code": "123_awesome",
                "name": "awesomeScript_3"
            }
        ];
        testUtils.insertScripts(scripts, function(error, scriptIds) {
            assert(error === null);
            scriptIds.length.should.equal(3);
            request.get({
                uri: BASE_URL + '/scripts?api_key=2112'
            }, function(error, response, body) {
                response.should.be.json;
                var bodyObj = JSON.parse(body);
                response.statusCode.should.equal(200);
                bodyObj.should.be.array;
                bodyObj.length.should.equal(3);
                done();
            });
        });

    });
});
