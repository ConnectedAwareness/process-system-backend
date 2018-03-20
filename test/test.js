// let expect = require("chai").expect
// // let request = require("request")
// let chai = require('chai')
// let chaiHttp = require('chai-http')
let server = require('../index')
// let close = app.close
// chai.use(chaiHttp)
// process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
// let server = require('../server/app')
let should = chai.should()

chai.use(chaiHttp)

describe('login', () => {
    it('should not login', (done) => {
        chai.request(server)
            .post('/login')
            .set({ 'Content-Type': 'application/x-www-form-urlencoded' })
            .send({
                'email': 'master@admin.de',
                'password': ''
            })
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
    it('should login', (done) => {
        chai.request(server)
            .post('/login')
            .set({ 'Content-Type': 'application/x-www-form-urlencoded' })
            .send({
                'email': 'master@admin.de',
                'password': 'pass'
            })
            .end((err, res) => {
                res.should.have.status(200)
                res.should.be.json
                res.body.should.have.property('token')
                done()
            })
    })
})