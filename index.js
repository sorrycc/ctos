'use strict';

var path = require('path');
var fs = require('fs');
var util = require('util');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var thunkify = require('thunkify');
var co = require('co');
var get = thunkify(request.get);

var download  = require('./lib/download');
var transform = require('./lib/transform');
var publish   = require('./lib/publish');
var log       = require('./lib/util/log');
var readJSON  = require('./lib/util/readJSON');

module.exports = function *(pkg, opt) {
  opt = opt || {};

  // trans specific version
  var hasVersion = pkg.indexOf('@') > -1;
  if (hasVersion) {
    yield runPkg(pkg, opt);
    return;
  }

  // trans all versions under a repo
  var repo = pkg;
  var tags = yield getTags(repo);
  // 
  var count = opt.count || 1;
  tags = tags.slice(tags.length - opt.count);
  var arr = [];
  for (var i=0; i<tags.length; i++) {
    var tag = tags[i];
    var _pkg = repo + '@' + tag;
    yield runPkg(_pkg, opt);
  }
};

function *runPkg(pkg, opt) {
  log.title('transform', pkg);
  
  pkg = normalizePkg(pkg);

  var url = 'https://github.com/'+pkg.repo+'/archive/'+pkg.version+'.zip';
  var tmpDir = opt.tmp || process.env.TMPDIR || '/tmp/';
  var dir = path.join(tmpDir, pkg.folder);

  log.info('tmpDir', tmpDir);

  log.info('download', url);
  // download zip and extract
  yield download(url, tmpDir, {extract:true});
  log.info('download', 'end');
  log.info('folder', dir);

  // valid
  if (!fs.existsSync(path.join(dir, 'component.json'))) {
    log.error('error', 'component.json not exist');
    return;
  }
  var c = readJSON(path.join(dir, 'component.json'));
  // if (!c.repo && !c.repository) {
  //   log.error('error', 'repo or repository not found in component.json');
  //   return;
  // }

  // transform component package to spm@3x
  transform(dir);

  // publish to spmjs.io
  yield publish(dir);

  log.info('done');
}

function *getTags(repo) {
  var url = 'https://github.com/' + repo + '/releases';

  log.info('request', url);
  var res = yield get(url);

  var $ = cheerio.load(res[0].body);
  var tags = [];

  $('div.release-timeline').children().each(function() {
    if ($(this).hasClass('release-timeline-tags')) {
      $('div.tag-info span.tag-name', this).each(function() {
        tags.push($(this).html().trim());
      });
    } else if ($(this).hasClass('release')) {
      $('div.release span.css-truncate-target', this).each(function() {
        tags.push($(this).html().trim());
      });
    }
  });

  tags.reverse();

  log.info('tags', tags.join(', '));
  return tags;
}

function normalizePkg(pkg) {
  var _pkg = pkg.split('@');
  var ret = {
    user: _pkg[0].split('/')[0],
    name: _pkg[0].split('/')[1],
    repo: _pkg[0],
    version: _pkg[1]
  };
  ret.folder = util.format('%s-%s', ret.name, ret.version.replace(/^v/, ''));
  return ret;
}
