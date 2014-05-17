'use strict';

var download = require('download');

module.exports = function(url, dir, opt, cb) {
  cb = cb || function() {};
  download(url, dir, opt)
    .on('error', cb)
    .on('close', cb);
};
