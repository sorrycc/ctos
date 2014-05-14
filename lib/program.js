'use strict';

var program = require('commander');

program
  .usage('PACKAGE [OPTIONS]')
  .version(require('../package').version, '-v, --version')
  .option('-c, --count <count>', 'how many last releases to transform, default is 1')
  .option('--tmp', 'tmp path to save downloaded package')
  .parse(process.argv);

module.exports = program;
