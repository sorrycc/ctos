'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var log = require('./util/log');
var readJSON = require('./util/readJSON');

module.exports = function(dir) {
  var c = readJSON(path.join(dir, 'component.json'));
  var ppath = path.join(dir, 'package.json');
  var p = readJSON(ppath);

  log.info('transform', 'start');

  // transform package.json
  log.info('transform', 'package.json');
  var newp = transPackageJSON(c, p);
  fs.writeFileSync(ppath, JSON.stringify(newp, null, 2), 'utf-8');

  // transform require dependence in files
  log.info('transform', 'require dependence');
  var files = c.scripts.map(function(f) {
    return path.join(dir, f);
  });
  var deps = Object.keys(newp.spm.dependencies);
  transFiles(files, deps);

  log.info('transform', 'end');
};

function transFiles(files, deps) {
  files.forEach(function(f) {
    transFile(f, deps);
  });
};

function transFile(file, deps) {
  var content = fs.readFileSync(file, 'utf-8');
  for (var dep in deps) {
    content = normalizeRequire(content, dep);
  }
  fs.writeFileSync(file, content, 'utf-8');
}

// Unique these component require style
// require('family-name')
// require('family/name')
// require('name')
function normalizeRequire(content, dep) {
  dep = dep.split('-');
  var family = dep[0];
  var name = dep.slice(1).join('-');
  var reStr = util.format('/require\([\'\"](%s[-\/])?%s[\'\"]\)/g', family, name);
  var re = new RegExp(reStr, 'gi');
  var newStr = util.format('require(\'%s-%s\')', family, name);
  content = content.replace(re, newStr);
}

function transPackageJSON(c, p) {
  // package.json support spm
  if (p.spm && p.spm.main) return p;

  // use component.json for package.json
  p = c;

  p.spm = p.spm || {};

  // set main
  p.spm.main = c.main || 'index.js';

  // set dependencies
  var deps = _.merge(c.dependencies, c.optional);
  p.spm.dependencies = transDeps(deps);
  p.spm.devDependencies = transDeps(c.development);

  return p;
}

function transDeps(deps) {
  deps = deps || {};
  var ret = {};
  for (var k in deps) {
    k = normalizeName(k);
    ret[k] = deps[k];
  }
  return ret;
}

////////////////////
// Helpers.

function normalizeName(name) {
  // replace the first /
  name = name.replace('/', '-');
  // replace .js suffix
  name = name.replace(/\.js$/, '');
  return name;
}
