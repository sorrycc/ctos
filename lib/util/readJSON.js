'use strict';

var fs = require('fs');

module.exports = function(file) {
  if (!fs.existsSync(file)) {
    return null;
  } else {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  }
};

