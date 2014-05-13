'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var util = require('util');
var log = require('./util/log');
var readJSON = require('./util/readJSON');

module.exports = function(dir) {
  var c = readJSON(path.join(dir, 'component.json'));
  var ppath = path.join(dir, 'package.json');
  var p = readJSON(ppath);

  log.info('transform', 'start');

  // transform package.json
  log.info('change', 'package.json');
  var newp = transPackageJSON(c, p);
  fs.writeFileSync(ppath, JSON.stringify(newp, null, 2), 'utf-8');

  // transform require dependence in files
  log.info('change', 'require dependence');
  var files = c.scripts.map(function(f) {
    return path.join(dir, f);
  });
  var deps = Object.keys(newp.spm.dependencies);
  log.info('deps', deps.join(', '));
  transFiles(files, deps);

  // add styles to main if styles exist
  if (c.styles && c.styles.length) {
    log.info('styles', c.styles.join(', '));
    var main = path.join(dir, newp.spm.main);
    addStyleToMain(main, c.styles);
  }

  log.info('transform', 'end');
};

function transPackageJSON(c, p) {
  // package.json support spm
  if (p.spm && p.spm.main) return p;

  // use component.json if package.json is not exist
  p = p || c;

  p.spm = p.spm || {};

  // set main
  p.spm.main = c.main || 'index.js';

  // set dependencies
  var deps = _.merge(c.dependencies, c.optional);
  p.spm.dependencies = normalizeDeps(deps);
  p.spm.devDependencies = normalizeDeps(c.development);

  return p;
}

function transFiles(files, deps) {
  files.forEach(function(f) {
    transFile(f, deps);
  });
};

function transFile(file, deps) {
  var content = fs.readFileSync(file, 'utf-8');
  for (var dep in deps) {
    content = replaceRequire(content, dep);
  }
  fs.writeFileSync(file, content, 'utf-8');
}

// Unique these component require style
// require('family-name')
// require('family/name')
// require('name')
function replaceRequire(content, dep) {
  dep = dep.split('-');
  var family = dep[0];
  var name = dep.slice(1).join('-');
  var reStr = util.format('/require\([\'\"](%s[-\/])?%s[\'\"]\)/g', family, name);
  var re = new RegExp(reStr, 'gi');
  var newStr = util.format('require(\'%s-%s\')', family, name);
  content = content.replace(re, newStr);
  return content;
}

function addStyleToMain(main, styles) {
  var content = fs.readFileSync(main, 'utf-8');
  styles.forEach(function(style) {
    content = 'require(\''+ relativePath(style) +'\');\n' + content;
  });
  fs.writeFileSync(main, content, 'utf-8');
}

////////////////////
// Helpers.

function relativePath(file) {
  if (file[0] != '.') {
    file = './' + file;
  }
  return file;
}

function normalizeDeps(deps) {
  deps = deps || {};
  var ret = {};
  for (var k in deps) {
    // k = normalizeName(k);
    ret[k] = deps[k];
  }
  return ret;
}

// function normalizeName(name) {
//   // replace the first /
//   name = name.replace('/', '-');
//   return name;
// }
