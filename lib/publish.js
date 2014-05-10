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

module.exports('/var/folders/p4/c620tt7n2f36ntjp05n48bg80000gn/T/page.js-1.3.7', function() {
  console.log('done publish');
});
