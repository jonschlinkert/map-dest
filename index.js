/*!
 * map-dest <https://github.com/jonschlinkert/map-dest>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var parsePath = require('parse-filepath');

/**
 * Calculate destination paths based on configuration.
 *
 * @param {String|Array} `src`
 * @param {String} `dest`
 * @param {Object} `options`
 * @return {Object}
 */

function mapDest(src, dest, options) {
  if (typeof src !== 'string') {
    throw new TypeError('expected a string');
  }

  if (typeof dest === 'object') {
    options = dest;
    dest = null;
  }

  options = options || {};
  var fp = src;

  // if `options.flatten` is defined, use the `src` basename
  if (options.flatten) fp = path.basename(fp);

  // if `options.ext` is defined, use it to replace extension
  if (options.hasOwnProperty('ext')) {
    fp = replaceExt(fp, options);
  }

  // use rename function to modify dest path
  var result = renameFn(dest, fp, options);

  // if `options.cwd` is defined, prepend it to `src`
  if (options.cwd) {
    src = path.join(options.cwd, src);
  }
  return {src: src, dest: result};
}

/**
 * Default rename function.
 */

function renameFn(dest, src, opts) {
  var isArray = Array.isArray(src);
  opts = opts || {};

  if (typeof opts.rename === 'function') {
    var ctx = parsePath(isArray ? src[0] : src);
    return opts.rename.call(ctx, dest, src, opts);
  }

  return dest
    ? path.join(dest, src)
    : isArray ? '' : src;
}


function unixify(fp) {
  return fp.split('\\').join('/');
}

function replaceExt(fp, opts) {
  var re = {first: /(\.[^\/]*)?$/, last: /(\.[^\/\.]*)?$/};
  opts = opts || {};
  if (typeof opts.extDot === 'undefined') {
    opts.extDot = 'first';
  }
  return fp.replace(re[opts.extDot], opts.ext);
}

/**
 * Expose `mapDest`
 */

module.exports = mapDest;

/**
 * Expose `renameFn`
 */

module.exports.rename = renameFn;
