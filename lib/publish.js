'use strict';

var spm = require('spm');
var path = require('path');
var fs = require('fs');
var log = require('./util/log');

module.exports = function(dir, cb) {

  log.info('publish', 'start');
  log.info('chdir', dir);
  process.chdir(dir);

  var pkg = readJSON(path.join(dir, 'package.json'), 'utf-8');
  spm.publish({tarball:true}, pkg, function(err) {
    if (err) throw new Error(err);
    log.info('publish', 'end');
    cb && cb(null);
  });
};

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}
