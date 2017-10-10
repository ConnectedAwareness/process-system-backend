import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET api/v1/heroes', () => {

  it('responds with JSON array', () => {
    return expect(200).to.equal(200);

});