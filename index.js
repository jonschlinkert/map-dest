/*!
 * map-dest <https://github.com/jonschlinkert/map-dest>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var utils = require('./utils');

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
  if (typeof src === 'object') {
    return fromObject(src, dest, opts);
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
    src = rewriteExt(src, opts);
  }

  // if `opts.flatten` is defined, use the `src` basename
  if (opts.flatten) {
    src = path.basename(src);
  }

  if (typeof opts.rename === 'function') {
    return opts.rename(dest, src, opts);
  }

  if (opts.destBase) {
    opts.destBase = utils.resolve(opts.destBase);
    dest = path.join(opts.destBase, dest || '');
  }

  var fp = typeof src === 'string' ? src : '';
  return dest ? path.join(dest, fp) : fp;
}

function fromObject(obj, dest, opts) {
  if (typeof dest === 'object') {
    opts = dest;
    dest = null;
  }
  var src = obj.src;
  if (!src) {
    src = opts.src;
    delete opts.src;
  }
  if (!dest) {
    dest = obj.dest;
    delete obj.dest;
  }
  if (!dest) {
    dest = opts.dest;
    delete opts.dest;
  }
  return mapDest(src, dest, opts);
}

function fromArray(src, dest, opts) {
  return src.map(function (fp) {
    return fromString(fp, dest, opts);
  });
}

function fromString(src, dest, opts) {
  if (typeof src !== 'string') {
    throw new TypeError('expected a string');
  }

  if (typeof dest === 'object') {
    opts = dest;
    dest = null;
  }

  opts = opts || {};
  var ctx = utils.extend({}, opts);
  ctx.src = src;
  ctx.dest = dest;

  // use rename function to modify dest path
  dest = renameFn.call(ctx, dest, src, opts);
  opts.cwd = utils.resolve(opts.cwd || '');

  if (opts.srcBase) {
    opts.cwd = path.join(opts.cwd, opts.srcBase);
  }
  if (opts.cwd) {
    src = path.join(opts.cwd, src);
  }

  return {
    options: opts,
    src: utils.normalize(src),
    dest: utils.normalize(dest)
  };
}

function replaceExt(fp, opts) {
  var re = {first: /(\.[^\/]*)?$/, last: /(\.[^\/\.]*)?$/};
  if (typeof opts.extDot === 'undefined') {
    opts.extDot = 'first';
  }
  return fp.replace(re[opts.extDot], opts.ext);
}

function rewriteExt(fp, opts) {
  if (opts.ext === false) {
    opts.ext = '';
  }

  if (opts.ext.charAt(0) !== '.') {
    opts.ext = '.' + opts.ext;
  }

  fp = replaceExt(fp, opts);
  if (fp.slice(-1) === '.') {
    fp = fp.slice(0, -1);
  }
  return fp;
}

/**
 * Expose `mapDest`
 */

module.exports = mapDest;

/**
 * Expose `renameFn`
 */

module.exports.rename = renameFn;
