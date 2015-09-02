/*!
 * map-dest <https://github.com/jonschlinkert/map-dest>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');

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
    return filesArray(src, dest, opts);
  }

  if (typeof src !== 'string') {
    throw new TypeError('expected a string');
  }

  if (typeof dest === 'object') {
    opts = dest;
    dest = null;
  }

  src = unixify(src);
  opts = opts || {};

  // use rename function to modify dest path
  dest = renameFn(dest, src, opts);

  if (opts.cwd) {
    src = path.join(opts.cwd, src);
  }

  return {
    options: opts,
    src: src,
    dest: unixify(dest || '')
  };
}

/**
 * Default rename function.
 */

function renameFn(dest, src, opts) {
  // if `opts.ext` is defined, use it to replace extension
  if (opts.hasOwnProperty('ext')) {
    src = replaceExt(src, opts);
  }

  // if `opts.flatten` is defined, use the `src` basename
  if (opts.flatten) {
    src = path.basename(src);
  }

  if (typeof opts.rename === 'function') {
    return opts.rename(dest, src, opts || {});
  }

  if (opts.destBase) {
    dest = path.join(opts.destBase, dest || '');
  }

  var fp = typeof src === 'string' ? src : '';
  return dest ? path.join(dest, src) : fp;
}

function filesArray(src, dest, opts) {
  return src.map(function (fp) {
    return mapDest(fp, dest, opts);
  });
}

function replaceExt(fp, opts) {
  var re = {first: /(\.[^\/]*)?$/, last: /(\.[^\/\.]*)?$/};
  if (typeof opts.extDot === 'undefined') {
    opts.extDot = 'first';
  }
  return fp.replace(re[opts.extDot], opts.ext);
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
