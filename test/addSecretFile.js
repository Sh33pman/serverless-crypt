'use strict';

const expect = require('chai').expect;
const path = require('path');
const fs = require('fs-extra');
const addSecretFile = require('./../lib/addSecretFile');
const Constants = require('../lib/constants');
Constants.SECRET_FILE = 'test2.json';

describe('addSecretFile()', () => {
  beforeEach(() => {
    addSecretFile.serverless = {
      config: {
        servicePath: path.dirname(__dirname),
      },
    };
    addSecretFile.secret_file = 'test.json';
    addSecretFile.options = {
      stage: 'test'
    };
  });

  afterEach(() => {
    fs.removeSync(path.join(addSecretFile.serverless.config.servicePath, Constants.SECRET_FILE));
  });

  it('should return BbPromise.resolve()', () => {
    fs.createFileSync(path.join(path.dirname(__dirname), addSecretFile.secret_file));
    
    addSecretFile.addSecretFile().then(() => {
      expect(true).to.equal(true);
    });
    fs.removeSync(path.join(path.dirname(__dirname), addSecretFile.secret_file));
  });

  it('should return BbPromise.rejected()', (done) => {
    addSecretFile.addSecretFile().then(() => {
      done('Success callback was not expected to be called')
    }, (err) => {
      expect('Secrets have not been configured for the test stage').to.equal(err);
      done();
    });
  });
});
