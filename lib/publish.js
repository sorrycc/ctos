'use strict';

var spm = require('spm');
var path = require('path');
var log = require('./util/log');

module.exports = function(dir, cb) {

  process.chdir(dir);

  var pkg = require(path.join(dir, 'package.json'));
  log.info('publish', 'start');
  spm.publish({}, pkg, function(err) {
    if (err) throw new Error(err);
    log.info('publish', 'end');
    cb && cb(null);
  });
};
