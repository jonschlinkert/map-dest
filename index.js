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

  if (typeof dest !== 'string') {
    options = dest;
    dest = null;
  }

  options = options || {};
  var fp = src;

  var isMatch = filterFn(fp, options);
  if (!isMatch) return false;

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
 * Default filter function.
 *
 * @param {String} `fp`
 * @param {Object} `opts`
 * @return {Boolean} Returns `true` if a file matches.
 */

function filterFn(fp, opts) {
  var filter = opts.filter;
  var isMatch = true;

  if (!filter) return isMatch;

  // if `options.filter` is a function, use it to
  // conditionally exclude a file from the result set
  if (typeof filter === 'function') {
    isMatch = filter(fp);

  // if `options.filter` is a string and matches a `fs.lstat`
  // method, call the `fs.lstat` method on the file
  } else if (typeof filter === 'string') {
    validateMethod(filter, opts);
    try {
      isMatch = fs.lstatSync(fp)[filter]();
    } catch (err) {
      isMatch = false;
    }
  }
  return isMatch;
}

/**
 * Default rename function.
 */

function renameFn(dest, src, options) {
  options = options || {};
  if (typeof options.rename === 'function') {
    var ctx = parsePath(src);
    return options.rename.call(ctx, dest, src, options);
  }
  return dest ? path.join(dest, src) : src;
}


function unixify(fp) {
  return fp.split('\\').join('/');
}

function replaceExt(fp, options) {
  var re = {first: /(\.[^\/]*)?$/, last: /(\.[^\/\.]*)?$/};
  options = options || {};
  if (typeof options.extDot === 'undefined') {
    options.extDot = 'first';
  }
  return fp.replace(re[options.extDot], options.ext);
}

/**
 * When the `filter` option is a string, validate
 * that the it's a valid `fs.lstat` method name.
 *
 * @param {String} `method`
 * @return {Boolean}
 */

function validateMethod(method) {
  var methods = ['isFile', 'isDirectory', 'isSymbolicLink'];
  if (methods.indexOf(method) < 0) {
    var msg = '[options.filter] `' + method + '` is not a valid fs.lstat method name';
    throw new Error(msg);
  }
}

/**
 * Expose `mapDest`
 */

module.exports = mapDest;
