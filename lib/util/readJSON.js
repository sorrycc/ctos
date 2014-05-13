'use strict';

var fs = require('fs');

module.exports = function(file) {
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
};

