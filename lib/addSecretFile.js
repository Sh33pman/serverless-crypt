'use strict';

const fs = require('fs-extra');
const path = require('path');
const BbPromise = require('bluebird');
const Constants = require('./constants');

module.exports = {
  addSecretFile() {
    if(!fs.existsSync(path.join(this.serverless.config.servicePath, this.secret_file))) {
      return BbPromise.reject('Secrets have not been configured for the ' + this.options.stage + ' stage');
    }

    fs.copySync(
      path.join(this.serverless.config.servicePath, this.secret_file),
      path.join(this.serverless.config.servicePath, Constants.SECRET_FILE)
    );
    return BbPromise.resolve();
  },
};