'use strict';

/* deps: mocha */
var fs = require('fs');
var path = require('path');
var util = require('util');
var gm = require('global-modules');
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
  describe('src', function () {
    it('should work when src is a string:', function () {
      var file = mapDest('a.txt', 'dist');
      assert(file[0].src === 'a.txt');
      assert(file[0].dest === 'dist/a.txt');
    });

    it('should work when src is an object:', function () {
      var file = mapDest({src: 'a.txt', dest: 'dist'});
      assert(file[0].src === 'a.txt');
      assert(file[0].dest === 'dist/a.txt');
    });

    it('should work when src is on options:', function () {
      var file = mapDest({dest: 'dist'}, {src: 'a.txt'});
      assert(file[0].src === 'a.txt');
      assert(file[0].dest === 'dist/a.txt');
    });

    it('should work when src is an object and dest is defined', function () {
      var file = mapDest({src: 'a.txt'}, 'dist');
      assert(file[0].src === 'a.txt');
      assert(file[0].dest === 'dist/a.txt');
    });

    it('should work when src is an object and opts are defined', function () {
      var file = mapDest({src: 'a.txt'}, {dest: 'dist'});
      assert(file[0].src === 'a.txt');
      assert(file[0].dest === 'dist/a.txt');
    });

    it('should work when src is an array', function () {
      var file = mapDest(['a.txt', 'b.txt'], 'dist');
      assert(file[0].src === 'a.txt');
      assert(file[0].dest === 'dist/a.txt');
      assert(file[1].src === 'b.txt');
      assert(file[1].dest === 'dist/b.txt');
    });

    it('should work when src is an array and dest is defined:', function () {
      var file = mapDest(['a.txt', 'b.txt'], 'dist');
      assert(file[0].src === 'a.txt');
      assert(file[0].dest === 'dist/a.txt');
      assert(file[1].src === 'b.txt');
      assert(file[1].dest === 'dist/b.txt');
    });
  });

  describe('no dest', function () {
    it('should create a dest when no `dest` argument is passed:', function () {
      var file = mapDest('a/b/c.txt');
      assert(file[0].src === 'a/b/c.txt');
      assert(file[0].dest === 'a/b/c.txt');
    });

    it('should work when src is an array:', function () {
      var file = mapDest(['a.txt', 'b.txt']);
      assert(file[0].src === 'a.txt');
      assert(file[1].src === 'b.txt');
    });
  });
});

describe('options', function () {
  describe('options.flatten', function () {
    it('should flatten dest when no `dest` argument is passed:', function () {
      var file = mapDest('a/b/c.txt', {flatten: true});
      assert(file[0].src === 'a/b/c.txt');
      assert(file[0].dest === 'c.txt');
    });
  });

  describe('options.ext', function () {
    it('should replace the destination extension with given ext:', function () {
      var file = mapDest('a/b/c.txt', {ext: '.foo'});
      assert(file[0].src === 'a/b/c.txt');
      assert(file[0].dest === 'a/b/c.foo');
    });

    it('should add a dot to the ext if not defined:', function () {
      var file = mapDest('a/b/c.txt', {ext: 'foo'});
      assert(file[0].src === 'a/b/c.txt');
      assert(file[0].dest === 'a/b/c.foo');
    });

    it('should strip the ext when ext is an empty string:', function () {
      var file = mapDest('a/b/c.txt', {ext: ''});
      assert(file[0].src === 'a/b/c.txt');
      assert(file[0].dest === 'a/b/c');
    });

    it('should strip the ext when ext is `false`:', function () {
      var file = mapDest('a/b/c.txt', {ext: false});
      assert(file[0].src === 'a/b/c.txt');
      assert(file[0].dest === 'a/b/c');
    });
  });

  describe('options.extDot', function () {
    it('should use the part after the last dot:', function () {
      var file = mapDest('a/b/c.min.coffee', {ext: 'js', extDot: 'last'});
      assert(file[0].dest === 'a/b/c.min.js');
    });

    it('should use the part after the first dot:', function () {
      var file = mapDest('a/b/c.min.coffee', {ext: 'js', extDot: 'first'});
      assert(file[0].dest === 'a/b/c.js');
    });
  });

  describe('options.cwd', function () {
    it('should prepend cwd to src:', function () {
      var file = mapDest('a/b/c.txt', {cwd: 'one/two'});
      assert(file[0].src === 'one/two/a/b/c.txt');
      assert(file[0].dest === 'a/b/c.txt');
    });

    it('should prepend cwd to src and flatten dest:', function () {
      var file = mapDest('a/b/c.txt', {cwd: 'one/two', flatten: true});
      assert(file[0].src === 'one/two/a/b/c.txt');
      assert(file[0].dest === 'c.txt');
    });

    it('should expand leading tilde in cwd:', function () {
      var home = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
      var file = mapDest('a/b/c.txt', {cwd: '~/one/two'});
      assert(file[0].options.cwd === path.join(home, 'one/two'));
      assert(file[0].src === path.join(home, 'one/two/a/b/c.txt'));
    });

    it('should expand leading @ in cwd:', function () {
      var file = mapDest('a/b/c.txt', {cwd: '@'});
      assert(file[0].options.cwd === gm);
      assert(file[0].src === path.join(gm, 'a/b/c.txt'));
    });
  });

  describe('options.srcBase', function () {
    it('should prepend `srcBase` to src:', function () {
      var file = mapDest('a/b/c.txt', {srcBase: 'one/two'});
      assert(file[0].src === 'one/two/a/b/c.txt');
      assert(file[0].dest === 'a/b/c.txt');
    });

    it('should prepend `srcBase` to src and flatten dest:', function () {
      var file = mapDest('a/b/c.txt', {srcBase: 'one/two', flatten: true});
      assert(file[0].src === 'one/two/a/b/c.txt');
      assert(file[0].dest === 'c.txt');
    });

    it('should append `srcBase` to `cwd`:', function () {
      var file = mapDest('a/b/c.txt', {srcBase: 'one/two', cwd: 'three'});
      assert(file[0].src === 'three/one/two/a/b/c.txt');
      assert(file[0].dest === 'a/b/c.txt');
    });

    it('should append `srcBase` to `cwd` and flatten dest:', function () {
      var file = mapDest('a/b/c.txt', {srcBase: 'one/two', cwd: 'three', flatten: true});
      assert(file[0].src === 'three/one/two/a/b/c.txt');
      assert(file[0].dest === 'c.txt');
    });
  });

  describe('options.destBase', function () {
    it('should prepend destBase to generated dest:', function () {
      var file = mapDest('a/b/c.txt', {destBase: 'one/two'});
      assert(file[0].src === 'a/b/c.txt');
      assert(file[0].dest === 'one/two/a/b/c.txt');
    });

    it('should prepend destBase to dest:', function () {
      var file = mapDest('a/b/c.txt', 'foo', {destBase: 'one/two'});
      assert(file[0].src === 'a/b/c.txt');
      assert(file[0].dest === 'one/two/foo/a/b/c.txt');
    });
  });

  describe('options.rename', function () {
    it('should support custom rename functions:', function () {
      var file = mapDest('a/b/c.md', {
        rename: function (dest, src, opts) {
          return src;
        }
      });
      assert(file[0].dest === 'a/b/c.md');
    });

    it('should expose target properties as `this` to rename function:', function () {
      var file = mapDest('index.js', 'foo/bar.js', {
        rename: function (dest, fp, options) {
          return path.join(path.dirname(dest), 'blog', path.basename(fp));
        }
      });
      file[0].dest.should.equal('foo/blog/index.js');
    });
  });
});

describe('rename', function () {
  it('should expose the rename function directly:', function () {
    var file = mapDest.rename('foo', 'a/b/c.md');
    assert(file === 'foo/a/b/c.md');
  });

  it('should work when src is an array:', function () {
    var file = mapDest.rename('foo', ['a/b/c.md']);
    assert(file === 'foo');
  });

  it('should use the rename function:', function () {
    var file = mapDest.rename('foo', 'a/b/c.md', {
      rename: function (dest, src, opts) {
        var name = path.basename(src, path.extname(src));
        return path.join(dest, name + '.html');
      }
    });
    assert(file === 'foo/c.html');
  });
});
