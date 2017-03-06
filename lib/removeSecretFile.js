'use strict';

const fs = require('fs-extra');
const path = require('path');
const BbPromise = require('bluebird');
const Constants = require('./constants');

module.exports = {
  removeSecretFile() {
    fs.removeSync(path.join(this.serverless.config.servicePath, Constants.SECRET_FILE));
    return BbPromise.resolve();
  },
};