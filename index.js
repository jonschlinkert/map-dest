/*!
 * map-dest <https://github.com/jonschlinkert/map-dest>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var gm = require('global-modules');
var tilde = require('expand-tilde');

/**
 * Calculate destination paths.
 *
 * @param {String|Array} `src`
 * @param {String} `dest`
 * @param {Object} `options`
 * @return {Object}
 */

function mapDest(src, dest, opts) {
  if (Array.isArray(src)) {
    return fromArray(src, dest, opts);
  }
  if (typeof str === 'object') {
    return [fromObject(src, dest, opts)];
  }
  return [fromString(src, dest, opts)];
}

/**
 * Default rename function.
 */

function renameFn(dest, src, opts) {
  dest = dest || '';
  opts = opts || {};

  // if `opts.ext` is defined, use it to replace extension
  if (opts.hasOwnProperty('ext')) {
    if (opts.ext === false) {
      opts.ext = '';
    }

    if (opts.ext.charAt(0) !== '.') {
      opts.ext = '.' + opts.ext;
    }

    src = replaceExt(src, opts);
    if (src.slice(-1) === '.') {
      src = src.slice(0, -1);
    }
  }

  // if `opts.flatten` is defined, use the `src` basename
  if (opts.flatten) {
    src = path.basename(src);
  }

  if (typeof opts.rename === 'function') {
    return opts.rename(dest, src, opts);
  }

  if (opts.destBase) {
    opts.destBase = resolveDir(opts.destBase);
    dest = path.join(opts.destBase, dest || '');
  }

  var fp = typeof src === 'string' ? src : '';
  return dest ? path.join(dest, fp) : fp;
}

function fromArray(src, dest, opts) {
  return src.map(function (fp) {
    return fromString(fp, dest, opts);
  });
}

function fromObject(src, dest, opts) {
  if (typeof src !== 'object') {
    throw new TypeError('expected an object');
  }
  if (typeof dest === 'object' && typeof opts === 'undefined') {
    opts = dest;
    dest = {};
  }
  if (typeof dest === 'string') {
    var tmp = {path: dest};
    dest = tmp;
  }
  dest = dest || {};
  opts = opts || {};

  dest.path = renameFn(dest.path, src.path, opts);
  opts.cwd = opts.cwd || '';
  opts.cwd = resolveDir(opts.cwd);

  if (opts.srcBase) {
    src.base = opts.srcBase;
  }
  if (opts.destCwd) {
    dest.cwd = opts.destCwd;
    dest.cwd = resolveDir(dest.cwd);
  }
  if (opts.destBase) {
    dest.base = opts.destBase;
  }

  if (opts.cwd) {
    src.path = path.join(opts.cwd, (src.base || '.'), src.path);
  } else if (src.base) {
    src.path = path.join(src.base, src.path);
  }

  if (dest.cwd) {
    dest.path = path.join(dest.cwd, dest.path);
  }

  src.path = unixify(src.path);
  dest.path = unixify(dest.path);

  return {
    options: opts,
    src: src,
    dest: dest
  };
}

function fromString(src, dest, opts) {
  if (typeof src === 'object') {
    return fromObject(src, dest, opts);
  }
  if (typeof src !== 'string') {
    throw new TypeError('expected a string');
  }
  return fromObject({path: src}, dest, opts);
}

function replaceExt(fp, opts) {
  var re = {first: /(\.[^\/]*)?$/, last: /(\.[^\/\.]*)?$/};
  if (typeof opts.extDot === 'undefined') {
    opts.extDot = 'first';
  }
  return fp.replace(re[opts.extDot], opts.ext);
}

function resolveDir(dir) {
  if (dir.charAt(0) === '~') {
    dir = tilde(dir);
  }
  if (dir.charAt(0) === '@') {
    dir = path.join(gm, dir.slice(1));
  }
  return dir;
}

function unixify(fp) {
  return fp.split('\\').join('/');
}

/**
 * Expose `mapDest`
 */

module.exports = mapDest;

/**
 * Expose `renameFn`
 */

module.exports.rename = renameFn;
