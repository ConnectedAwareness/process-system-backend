let expect = require("chai").expect
let request = require("request")
let chai = require('chai')
let chaiHttp = require('chai-http')
let app = require('../index')
let close = app.close
chai.use(chaiHttp)
process.env.NODE_ENV = 'test'

describe("Color Code Converter", function() {

    describe("First test", function() {
        it("First subtest", function() {
            expect(2).to.equal(2)
        });
    });

    describe("First http-test", function() {
        chai.request(app).get('/').end((err, res) => {
            expect(res.status).to.equal(200)
        });
    });
});