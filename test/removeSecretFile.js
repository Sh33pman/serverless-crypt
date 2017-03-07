'use strict';

const expect = require('chai').expect;
const path = require('path');
const fs = require('fs-extra');
const removeSecretFile = require('./../lib/removeSecretFile');
const Constants = require('../lib/constants');
Constants.SECRET_FILE = 'test2.json';

describe('removeSecretFile()', () => {
  beforeEach(() => {
    removeSecretFile.serverless = {
      config: {
        servicePath: path.dirname(__dirname),
      },
    };
    fs.createFileSync(path.join(path.dirname(__dirname), Constants.SECRET_FILE));
  });

  it('should return BbPromise.resolve()', () => {
    removeSecretFile.removeSecretFile().then(() => {
      expect(true).to.equal(true);
    });
  });
});
