'use strict';

var readJSON = require('../lib/util/readJSON');

describe('util', function() {

  it('readJSON', function() {
    String(readJSON('./test/unexist.json')).should.be.eql('null');
    readJSON('./test/fixtures/readJSON.json').should.be.eql({a:1});
  });
});

