'use strict';

var download = require('download');

var main = function(url, dir, opt, cb) {
  download(url, dir, opt)
    .on('close', cb || function() {});
};

module.exports = main;
