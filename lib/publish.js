'use strict';

var spm = require('spm');
var path = require('path');
var fs = require('fs');
var log = require('./util/log');
var readJSON = require('./util/readJSON');

module.exports = function(dir, cb) {
  log.info('publish', 'start');

  log.info('chdir', dir);
  process.chdir(dir);
  
  var pkg = readJSON(path.join(dir, 'package.json'), 'utf-8');
  spm.publish({tarball:true, force:true}, pkg, function(err) {
    log.info('publish', 'end');
    cb &&cb(err);
  });
};
