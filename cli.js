#!/usr/bin/env node
'use strict';

var co = require('co');
var ctos = require('./');
var program = require('./lib/program');

var pkg = program.args[0];

co(function *() {
  yield ctos(pkg, program);
})();
