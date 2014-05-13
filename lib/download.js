'use strict';

var download = require('download');
var thunkify = require('thunkify');
var log = require('./util/log');

var down = function(url, dir, opt, cb) {
  cb = cb || function() {};
  download(url, dir, opt)
    .on('error', cb)
    .on('close', cb);
};

module.exports = function *(url, dir, opt) {
  yield thunkify(down)(url, dir, opt);
};
