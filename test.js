'use strict';

/* deps: mocha */
var path = require('path');
var util = require('util');
var assert = require('assert');
var should = require('should');
var mapDest = require('./');

var inspect = function(obj) {
  return util.inspect(obj, null, 10);
};

describe('errors', function () {
  it('should throw an error when src is not a string:', function () {
    (function () {
      mapDest();
    }).should.throw('expected a string');
  });
});

describe('mapDest', function () {
  describe('no dest', function () {
    it('should create a dest when no `dest` argument is passed:', function () {
      var actual = mapDest('a/b/c.txt');
      assert(actual.src === 'a/b/c.txt');
      assert(actual.dest === 'a/b/c.txt');
    });
  });

  describe('no dest', function () {
    it('should work when src is an array:', function () {
      var actual = mapDest(['a.txt', 'b.txt']);
      assert(actual[0].src === 'a.txt');
      assert(actual[1].src === 'b.txt');
    });
  });
});

describe('options', function () {
  describe('options.flatten', function () {
    it('should flatten dest when no `dest` argument is passed:', function () {
      var actual = mapDest('a/b/c.txt', {flatten: true});
      assert(actual.src === 'a/b/c.txt');
      assert(actual.dest === 'c.txt');
    });
  });

  describe('options.ext', function () {
    it('should replace the destination extension with given ext:', function () {
      var actual = mapDest('a/b/c.txt', {ext: '.foo'});
      assert(actual.src === 'a/b/c.txt');
      assert(actual.dest === 'a/b/c.foo');
    });
  });

  describe('options.cwd', function () {
    it('should prepend cwd to src:', function () {
      var actual = mapDest('a/b/c.txt', {cwd: 'one/two'});
      assert(actual.src === 'one/two/a/b/c.txt');
      assert(actual.dest === 'a/b/c.txt');
    });

    it('should prepend cwd to src and flatten dest:', function () {
      var actual = mapDest('a/b/c.txt', {cwd: 'one/two', flatten: true});
      assert(actual.src === 'one/two/a/b/c.txt');
      assert(actual.dest === 'c.txt');
    });
  });

  describe('options.destBase', function () {
    it('should prepend destBase to generated dest:', function () {
      var actual = mapDest('a/b/c.txt', {destBase: 'one/two'});
      assert(actual.src === 'a/b/c.txt');
      assert(actual.dest === 'one/two/a/b/c.txt');
    });

    it('should prepend destBase to dest:', function () {
      var actual = mapDest('a/b/c.txt', 'foo', {destBase: 'one/two'});
      assert(actual.src === 'a/b/c.txt');
      assert(actual.dest === 'one/two/foo/a/b/c.txt');
    });
  });

  describe('options.rename', function () {
    it('should support custom rename functions:', function () {
      var actual = mapDest('a/b/c.md', {
        rename: function (dest, src, opts) {
          return src;
        }
      });
      assert(actual.dest === 'a/b/c.md');
    });

    it('should expose target properties as `this` to rename function:', function () {
      var actual = mapDest('index.js', 'foo/bar.js', {
        rename: function (dest, fp, options) {
          return path.join(path.dirname(dest), 'blog', path.basename(fp));
        }
      });
      actual.dest.should.equal('foo/blog/index.js');
    });
  });
});
