'use strict';

var thunkify = require('thunkify');
var download = require('download');

var main = function(url, dir, opt, cb) {
  download(url, dir, opt)
    .on('close', cb || function() {});
};

main.co = thunkify(download);
module.exports = main;
