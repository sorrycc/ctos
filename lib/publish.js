'use strict';

var spm = require('spm');
var path = require('path');
var fs = require('fs-extra');
var log = require('./util/log');

module.exports = function(dir, force, cb) {
  log.info('publish', 'start');

  log.info('chdir', dir);
  process.chdir(dir);
  
  var pkg = fs.readJSONSync(path.join(dir, 'package.json'));
  spm.publish({tarball:true, force:force}, pkg, function(err) {
    log.info('publish', 'end');
    cb &&cb(err);
  });
};
