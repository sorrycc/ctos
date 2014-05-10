'use strict';

var download = require('download');
var log = require('./util/log');

var main = function(url, dir, opt, cb) {
  download(url, dir, opt)
    .on('error', function(e) {
      log.info('error', e);
    })
    .on('close', cb || function() {});
};

module.exports = main;
