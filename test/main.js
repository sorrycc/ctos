'use strict';

var readJSON = require('../lib/util/readJSON');

describe('util', function() {

  it('readJSON', function() {
    String(readJSON('./test/unexist.json')).should.be.eql('null');
    readJSON('./test/fixtures/a.json').should.be.eql({a:1});
  });
});

