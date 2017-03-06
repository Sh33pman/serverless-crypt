'use strict';

const BbPromise = require('bluebird');
const validate = require('serverless/lib/plugins/aws/lib/validate');
const encrypt = require('./lib/encrypt');
const decrypt = require('./lib/decrypt');
const saveSecret = require('./lib/saveSecret');
const addLibraries = require('./lib/addLibraries');
const removeLibraries = require('./lib/removeLibraries');
const addSecretFile = require('./lib/addSecretFile');
const removeSecretFile = require('./lib/removeSecretFile');

class Crypt {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options || {};
    this.provider = this.serverless.getProvider('aws');
    this.secret_file  = '.serverless-secret-' + (this.options.stage || this.serverless.service.provider.stage) + '.json';
    
    Object.assign(
      this,
      validate,
      encrypt,
      decrypt,
      saveSecret,
      addLibraries,
      removeLibraries,
      addSecretFile,
      removeSecretFile
    );

    this.commands = {
      encrypt: {
        usage: 'Encrypt the secret',
        lifecycleEvents: [
          'encrypt',
        ],
        options: {
          name: {
            usage: 'Name of the secert',
            shortcut: 'n',
            required: true,
          },
          stage: {
            usage: 'Name of the stage',
            shortcut: 's',
            required: true,
          },
          text: {
            usage: 'Plaintext to encrypt',
            shortcut: 't',
          },
          save: {
            usage: `Save the encrypted secret (to ${this.secret_file}`,
          },
        },
      },
      decrypt: {
        usage: 'Decrypt the encrypted secret',
        lifecycleEvents: [
          'decrypt',
        ],
        options: {
          name: {
            usage: 'Name of the secert',
            shortcut: 'n',
            required: true,
          },
        },
      },
    };

    this.hooks = {
      'before:deploy:function:deploy': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.addLibraries)
        .then(this.addSecretFile),
      'after:deploy:function:deploy': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.removeLibraries)
        .then(this.removeSecretFile),
      'before:deploy:createDeploymentArtifacts': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.addLibraries)
        .then(this.addSecretFile),
      'after:deploy:deploy': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.removeLibraries)
        .then(this.removeSecretFile),
      'encrypt:encrypt': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.encrypt)
        .then(this.saveSecret),
      'decrypt:decrypt': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.decrypt),
    };
  }
}

module.exports = Crypt;
