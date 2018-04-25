'use strict';

let api = undefined;
const {expect} = require('chai');
let log = require('debug')('test');
let sinon = require('sinon');
let PassThrough = require('stream').PassThrough;
let Request = require('../requests.js');

process.on('unhandledRejection', function(p, reason) {
  console.error('Rejection at promise:', p, 'for reason:', reason);
  console.error(reason.stack);
});

// setup
before(function(done) {
  let API = require('../index.js');
  api = API();
  done();
});

describe('api.getDataPage', function() {
  it('should return response with status code and body', function() {
    let expected = {
      statusCode: 200,
      body: {
        foo: 'test',
      },
    };

    this.request = sinon.stub(Request, 'get');
    this.request.resolves(expected);

    api.getDataPage().then(function(res) {
      expect(res.statusCode).to.eql(200);
      expect(res.body).to.eql(expected.body);
      Request.get.restore();
    });
  });

  it('should throw properly emit error', function() {
    let expectedError = {
      code: 401,
      message: 'Unauthorized',
    };

    this.request = sinon.stub(Request, 'get');
    this.request.rejects(expectedError);

    api.getDataPage().catch(function(error) {
      expect(error).to.eql(expectedError);
      Request.get.restore();
    });
  });

  it('should be called with proper url', function() {
    let expectedUri = '/data';

    this.request = sinon.spy(Request, 'get');

    api.getDataPage();
    expect(this.request.calledWith(expectedUri));
    Request.get.restore();
  });
});

describe('api.listData', function() {
  it('should be called with proper url', function() {
    let expectedUri = '/data/list';

    this.request = sinon.spy(Request, 'get');

    api.listData();
    expect(this.request.calledWith(expectedUri));
    Request.get.restore();
  });
});

describe('api.getDataDetails', function() {
  it('should be called with proper url', function() {
    let dataId = '2039xjdosiDSK123';
    let expectedUri = '/data/' + dataId;

    this.request = sinon.spy(Request, 'get');

    api.getDataDetails(dataId);
    expect(this.request.calledWith(expectedUri));
    Request.get.restore();
  });
});

// teardown
after(function(done) {
  done();
});
