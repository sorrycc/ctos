#!/usr/bin/env node
'use strict';

var program = require('commander');
var co = require('co');
var c2s = require('./');

program
  .usage('PACKAGE')
  .version(require('./package').version, '-v, --version')
  .parse(process.argv);

var pkg = program.args[0];

if (!pkg) {
  return program.help();
}

co(function *() {
  yield c2s(pkg);
})();
