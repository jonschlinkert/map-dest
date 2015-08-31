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
      assert.deepEqual(actual, {src: 'a/b/c.txt', dest: 'a/b/c.txt'});
    });
  });
});

describe('options', function () {
  describe('options.flatten', function () {
    it('should flatten dest when no `dest` argument is passed:', function () {
      var actual = mapDest('a/b/c.txt', {flatten: true});
      assert.deepEqual(actual, {src: 'a/b/c.txt', dest: 'c.txt'});
    });
  });

  describe('options.ext', function () {
    it('should replace the destination extension with given ext:', function () {
      var actual = mapDest('a/b/c.txt', {ext: '.foo'});
      assert.deepEqual(actual, {src: 'a/b/c.txt', dest: 'a/b/c.foo'});
    });
  });

  describe('options.cwd', function () {
    it('should prepend cwd to src:', function () {
      var actual = mapDest('a/b/c.txt', {cwd: 'one/two'});
      assert.deepEqual(actual, {src: 'one/two/a/b/c.txt', dest: 'a/b/c.txt'});
    });

    it('should prepend cwd to src and flatten dest:', function () {
      var actual = mapDest('a/b/c.txt', {cwd: 'one/two', flatten: true});
      assert.deepEqual(actual, {src: 'one/two/a/b/c.txt', dest: 'c.txt'});
    });
  });

  describe('options.filter', function () {
    it('should support custom filter functions:', function () {
      var actual = mapDest('a/b/c.txt', {
        filter: function (str) {
          return !/\.txt/.test(str);
        }
      });
      assert(!actual);
    });

    it('should filter by fs.lstat method (false if file !exists):', function () {
      assert(!mapDest('a/b/c.txt', {filter: 'isFile'}));
    });

    it('should filter by fs.lstat method (truthy if file exists):', function () {
      assert(mapDest('index.js', {filter: 'isFile'}));
      var actual = mapDest('index.js', {filter: 'isFile'});
      assert(actual.src === 'index.js');
    });
  });


  describe('options.rename', function () {
    it('should support custom rename functions:', function () {
      var actual = mapDest('a/b/c.md', {
        rename: function (str) {
          return
        }
      });

      // assert(actual.src === 'a/b/c.html');
    });
});
