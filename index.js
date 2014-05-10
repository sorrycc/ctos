'use strict';

var path = require('path');
var util = require('util');
var download = require('./lib/download');
var transform = require('./lib/transform');
var publish = require('./lib/publish');
var log = require('./lib/util/log');

module.exports = function(pkg, opt, cb) {
  log.title('transform', pkg);

  if (typeof opt === 'function') {
    cb = opt, opt = null;
  }
  
  opt = opt || {};
  pkg = parse(pkg);

  var url = 'https://github.com/'+pkg.repo+'/archive/'+pkg.version+'.zip';
  var tmpDir = opt.tmpDir || process.env.TMPDIR || '/tmp/';

  log.info('tmpDir', tmpDir);
  log.info('download', url);

  // download zip and extract
  download(url, tmpDir, {extract:true}, function(err) {
    if (err) throw new Error(err);

    // transform component package to spm@3x
    var dir = path.join(tmpDir, pkg.folder);
    log.info('download', 'end');
    log.info('dir', dir);
    transform(dir); 

    // publish to spmjs.io
    publish(dir, function() {
      log.info('done');
      cb(null);
    });
  });
}

function parse(pkg) {
  var _pkg = pkg.split('@');
  var ret = {
    user: _pkg[0].split('/')[0],
    name: _pkg[0].split('/')[1],
    repo: _pkg[0],
    version: _pkg[1]
  };
  ret.folder = util.format('%s-%s', ret.name, ret.version);
  return ret;
}

if (!module.parent) {
  module.exports('visionmedia/page.js@1.3.5', function(err, dir) {
    console.log('donedonedone');
  });
}

