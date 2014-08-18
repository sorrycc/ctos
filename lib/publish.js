'use strict';

var client = require('spm-client');
var path = require('path');
var fs = require('fs-extra');
var log = require('./util/log');
var co = require('co');

module.exports = function(dir, force, cb) {
  log.info('publish', 'start');
  log.info('chdir', dir);
  process.chdir(dir);

  co(client.publish)({
    cwd:dir,
    force: force
  }, function(err) {
    if (err) {
      console.log(err);
      process.exit(1);
    };
    log.info('publish', 'end');
    cb && cb(err);
  });
};
