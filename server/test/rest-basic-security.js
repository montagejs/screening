var request = require("request"),
    testUtils = require("./test-utils");
const BASE_URL = testUtils.BASE_URL;

describe("REST Error Handling", function() {
    before(function(done) {
        testUtils.startServer();
        setTimeout(done, 500);
    });

    after(function(done){
        testUtils.stopServer();
        done();
    });

    /**
     * /foo does not exist, it should return a 404 even with an api_key
     */
    it('404 on service not yet implemented', function(done) {
        request.get({
            uri: BASE_URL + '/foo?api_key=2112'
        }, function(error, response, body) {
            response.should.be.json;
            var bodyObj = JSON.parse(body);
            response.statusCode.should.equal(404);
            bodyObj.should.eql({error: "Resource not found"});
            done();
        });
    });

    /**
     * /foo does not exist and an api_key is not specified
     */
    it('401 on request without the api_key', function(done) {
        request.get({
            uri: BASE_URL + '/foo'
        }, function(error, response, body) {
            response.should.be.json;
            var bodyObj = JSON.parse(body);
            response.statusCode.should.equal(401);
            bodyObj.should.have.property("error", "api key required");
            done();
        });
    });

    it('401 on wrong api key', function(done) {
        request.get({uri: BASE_URL + '/agents?api_key=xxx'}, function(error, response, body) {
            response.should.be.json;
            var bodyObj = JSON.parse(body);
            response.statusCode.should.equal(401);
            bodyObj.should.have.property("error", "invalid api key");
            done();
        });
    });
});