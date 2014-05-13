'use strict';

var chalk = require('chalk');
var util = require('util');

var log = module.exports = {};

log.width = 15;

log.info = function(cat) {
  var args = Array.prototype.slice.call(arguments).slice(1);
  var str = util.format.apply(util, args);
  console.info(getMsg(cat, str, 'cyan'));
};

log.error = function(cat) {
  var args = Array.prototype.slice.call(arguments).slice(1);
  var str = util.format.apply(util, args);
  console.error(getMsg(cat, str, 'red'));
};

log.title = function(cat) {
  var args = Array.prototype.slice.call(arguments).slice(1);
  var str = util.format.apply(util, args);
  console.info(getMsg(cat, str, 'magenta'));
};

////////////////////
// Helpers.

function getMsg(cat, msg, color) {
  cat = lpad(cat, log.width, ' ');
  cat = chalk[color](cat);
  return cat + ': ' + msg;
}

function lpad(str, len, padStr) {
  while (str.length < len) str = padStr + str;
  return str;
}
