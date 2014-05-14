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
  if (c.scripts) {
    var files = c.scripts.map(function(f) {
      return path.join(dir, f);
    });
    var deps = Object.keys(c.dependencies || {});
    log.info('deps', deps.join(', '));
    transFiles(files, deps);
  }

  // add styles to main if styles exist
  if (!isCSSPackage(c) && c.styles && c.styles.length) {
    log.info('styles', c.styles.join(', '));
    var main = path.join(dir, newp.spm.main);
    addStyleToMain(main, c.styles);
  }

  log.info('transform', 'end');
};

function isCSSPackage(c) {
  return !!((!c.scripts || !c.scripts.length) && c.styles);
}

function transPackageJSON(c, p) {
  // package.json support spm
  if (p && p.spm && p.spm.main) return p;

  // use component.json if package.json is not exist
  p = p || c;

  p.spm = p.spm || {};

  // set main
  if (isCSSPackage(c)) {
    if (c.styles.length > 1) {
      var e = 'css package should only has one output';
      log.error('error', e);
      throw new Error(e);
    }
    p.spm.main = c.styles[0];
  } else {
    p.spm.main = c.main || 'index.js';
  }

  // set dependencies
  var deps = _.merge(c.dependencies, c.optional);
  log.info('old deps', deps);
  p.spm.dependencies = normalizeDeps(deps);
  // p.spm.devDependencies = normalizeDeps(c.development);

  // set name
  p.name = c.name.toLowerCase();

  // no private
  delete p.private

  return p;
}

function transFiles(files, deps) {
  files.forEach(function(f) {
    transFile(f, deps);
  });
};

function transFile(file, deps) {
  var content = fs.readFileSync(file, 'utf-8');
  deps.forEach(function(dep) {
    content = replaceRequire(content, dep);
  });
  fs.writeFileSync(file, content, 'utf-8');
}

// Unique these component require style
// require('family-name')
// require('family/name')
// require('name')
function replaceRequire(content, dep) {
  dep = dep.split('/');
  var family = dep[0];
  var name = dep.slice(1).join('-');
  var re = new RegExp('require\\\([\'\"]('+family+'[-\/])?'+name+'[\'\"]\\\)', 'gi');
  var newStr = util.format('require(\'%s\')', name);
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

// add depsMap because spm don't support *
var depsMap = readJSON(path.join(__dirname, '../deps.json'));

function normalizeDeps(deps) {
  deps = deps || {};
  var ret = {};
  for (var k in deps) {
    k = k.toLowerCase();
    var map = depsMap[k];
    if (!map) {
      var e = 'deps ' + k + ' not found in exist map';
      log.error('error', e);
      throw new Error(e)
    }
    ret[map[0]] = map[1];
  }
  return ret;
}
