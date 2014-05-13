'use strict';

var spm = require('spm');
var path = require('path');
var fs = require('fs');
var thunkify = require('thunkify');
var log = require('./util/log');
var readJSON = require('./util/readJSON');
var publish = thunkify(spm.publish);

module.exports = function *(dir) {
  log.info('publish', 'start');
  log.info('chdir', dir);
  process.chdir(dir);

  var pkg = readJSON(path.join(dir, 'package.json'), 'utf-8');

  yield publish({tarball:true}, pkg);
  log.info('publish', 'end');
};
