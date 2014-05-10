'use strict';

var path = require('path');
var fs = require('fs');
var util = require('util');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var download = require('./lib/download');
var transform = require('./lib/transform');
var publish = require('./lib/publish');
var log = require('./lib/util/log');

module.exports = function(pkg, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt, opt = null;
  }

  var hasVersion = pkg.indexOf('@') > -1;
  if (hasVersion) {
    transformByVersion(pkg, opt, cb);
    return;
  }

  getRelease(pkg, function(err, tags) {
    async.eachSeries(tags, function(tag, next) {
      var _pkg = pkg + '@' + tag;
      transformByVersion(_pkg, opt, next);
    }, cb);
  });
};

function transformByVersion(pkg, opt, cb) {
  log.title('transform', pkg);
  
  opt = opt || {};
  pkg = parse(pkg);

  var url = 'https://github.com/'+pkg.repo+'/archive/'+pkg.version+'.zip';
  var tmpDir = opt.tmpDir || process.env.TMPDIR || '/tmp/';

  log.info('tmpDir', tmpDir);
  log.info('download', url);

  // download zip and extract
  download(url, tmpDir, {extract:true}, function(err) {
    if (err) throw new Error(err);

    var dir = path.join(tmpDir, pkg.folder);
    log.info('download', 'end');
    log.info('dir', dir);

    // valid
    if (!fs.existsSync(path.join(dir, 'component.json'))) {
      log.error('error', 'component.json not exist');
      return cb(null);
    }
    var c = require(path.join(dir, 'component.json'));
    if (!c.repo && !c.repository) {
      log.error('error', 'repo or repository not found in component.json');
      return cb(null);
    }

    // transform component package to spm@3x
    transform(dir);

    // publish to spmjs.io
    publish(dir, function() {
      log.info('done');
      cb(null);
    });
  });
}

function getRelease(repo, cb) {
  var url = 'https://github.com/' + repo + '/releases';
  log.info('fetch release', url);
  request(url, function(err, res, body) {
    if (err || res.statusCode != 200) {
      log.error('error', err || res.statusCode);
      return cb(err || 'res');
    }
    var $ = cheerio.load(body);
    var tags = [];
    $('div.tag-info span.tag-name').each(function() {
      tags.push($(this).html().trim());
    });
    tags.reverse();
    log.info('tags', tags.join(', '));
    cb(null, tags);
  });
}

function parse(pkg) {
  var _pkg = pkg.split('@');
  var ret = {
    user: _pkg[0].split('/')[0],
    name: _pkg[0].split('/')[1],
    repo: _pkg[0],
    version: _pkg[1]
  };
  ret.folder = util.format('%s-%s', ret.name, ret.version);
  return ret;
}
