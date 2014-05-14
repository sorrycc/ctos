'use strict';

var fs = require('fs-extra');
var path = require('path');
var transform = require('../lib/transform')

describe('transform', function() {

  before(function() {
    fs.copySync('./test/fixtures/transform', './test/fixtures/transformTest');
  });

  after(function() {
    fs.removeSync('./test/fixtures/transformTest');
  });

  it('css package', function() {
    var dir = path.join(__dirname, './fixtures/transformTest/', 'css-package');
    transform(dir);
    var p = require(path.join(dir, 'package.json'));
    p.spm.main.should.be.eql('dist/toggle-switch.css');
  });

  it('css package with multiple styles', function() {
    var dir = path.join(__dirname, './fixtures/transformTest/', 'css-package-with-multiple-styles');
    try {
      transform(dir);
    } catch(e) {}
    fs.existsSync(path.join(dir, 'package.json')).should.be.eql(false);
  });
});

