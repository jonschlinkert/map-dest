# map-dest [![NPM version](https://badge.fury.io/js/map-dest.svg)](http://badge.fury.io/js/map-dest)

> Map the destination path for a file based on the given source path and options.

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i map-dest --save
```

## Usage

```js
var mapDest = require('map-dest');
```

## Table of contents

- [docs](#docs)
  * [src](#src)
  * [dest](#dest)
- [options](#options)
  * [options.flatten](#optionsflatten)
  * [options.ext](#optionsext)
  * [options.cwd](#optionscwd)
  * [options.destBase](#optionsdestbase)
  * [options.rename](#optionsrename)
- [Related projects](#related-projects)
- [Test coverage](#test-coverage)
- [Running tests](#running-tests)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

## docs

### src

Returns an array when `src` is an array

```js
mapDest(['a.txt', 'b.txt'], 'dist');
// [ { options: {}, src: 'a.txt', dest: 'dist/a.txt' },
//   { options: {}, src: 'b.txt', dest: 'dist/b.txt' } ]
```

### dest

Creates a dest when no `dest` argument is passed.

```js
mapDest('a/b/c.txt');
// [{ options: {}, src: 'a/b/c.txt', dest: 'a/b/c.txt' }]
```

When no `dest` is defined and `src` is an array, returns an array with generated `dest` paths.

```js
mapDest(['a.txt', 'b.txt']);
// [ { options: {}, src: 'a.txt', dest: 'a.txt' },
//   { options: {}, src: 'b.txt', dest: 'b.txt' } ]
```

## options

### options.flatten

Flattens `dest` when no `dest` argument is passed:

```js
mapDest('a/b/c.txt', {flatten: true});
// [{ options: { flatten: true }, src: 'a/b/c.txt', dest: 'c.txt' }]
```

### options.ext

Replaces the destination extension with given `ext`:

```js
mapDest('a/b/c.txt', {ext: '.foo'});
// [{ options: { ext: '.foo', extDot: 'first' },
//   src: 'a/b/c.txt',
//   dest: 'a/b/c.foo' }]
```

### options.cwd

When `cwd` is defined it will be prepended to `src`:

```js
mapDest('a/b/c.txt', {cwd: 'one/two'});
// [{ options: { cwd: 'one/two' },
//   src: 'one/two/a/b/c.txt',
//   dest: 'a/b/c.txt' }]
```

Prepends `cwd` to `src` and flattens `dest`:

```js
mapDest('a/b/c.txt', {cwd: 'one/two', flatten: true});
// [{ options: { cwd: 'one/two', flatten: true },
//   src: 'one/two/a/b/c.txt',
//   dest: 'c.txt' }]
```

Expands tildes in `cwd` to make the path relative to the user's home directory:

```js
mapDest('a/b/c.txt', {cwd: '~/one/two'});
// [{ options: { cwd: '/User/jonschlinkert/one/two', flatten: true },
//   src: 'one/two/a/b/c.txt',
//   dest: 'c.txt' }]
```

Expands `@` in `cwd` to make the path relative to global npm modules:

```js
mapDest('templates/base.hbs', {cwd: '@/boilerplate-h5bp'});
// [ { options: { cwd: '/usr/local/lib/node_modules/boilerplate-h5bp' },
//     src: '/usr/local/lib/node_modules/boilerplate-h5bp/templates/base.hbs',
//     dest: 'templates/base.hbs' } ]
```

### options.destBase

If `destBase` is defined it's prepended to generated dest.

```js
mapDest('a/b/c.txt', {destBase: 'one/two'});
// [{ options: { destBase: 'one/two' },
//   src: 'a/b/c.txt',
//   dest: 'one/two/a/b/c.txt' }]
```

If `destBase` is defined, it will be prepended to dest

```js
mapDest('a/b/c.txt', 'foo', {destBase: 'one/two'});
// [{ options: { destBase: 'one/two' },
//   src: 'a/b/c.txt',
//   dest: 'one/two/foo/a/b/c.txt' }]
```

### options.rename

A custom `rename` function can be used to modify the generated `dest` path.

```js
mapDest('a/b/c.md', {
  rename: function (dest, src, opts) {
    return 'dist/' + path.basename(src) + '.html';
  }
});
// [{ options: { rename: [Function] },
//   src: 'a/b/c.md',
//   dest: 'dist/c.html' }]
```

## Related projects

* [expand-config](https://www.npmjs.com/package/expand-config): Expand tasks, targets and files in a declarative configuration. | [homepage](https://github.com/jonschlinkert/expand-config)
* [expand-files](https://www.npmjs.com/package/expand-files): Expand glob patterns in a declarative configuration into src-dest mappings. | [homepage](https://github.com/jonschlinkert/expand-files)
* [expand-target](https://www.npmjs.com/package/expand-target): Expand target definitions in a declarative configuration. | [homepage](https://github.com/jonschlinkert/expand-target)
* [expand-task](https://www.npmjs.com/package/expand-task): Expand and normalize task definitions in a declarative configuration. | [homepage](https://github.com/jonschlinkert/expand-task)
* [files-objects](https://www.npmjs.com/package/files-objects): Expand files objects into src-dest mappings. | [homepage](https://github.com/jonschlinkert/files-objects)

## Test coverage

```
-----------|----------|----------|----------|----------|----------------|
File       |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-----------|----------|----------|----------|----------|----------------|
 map-dest/ |      100 |      100 |      100 |      100 |                |
  index.js |      100 |      100 |      100 |      100 |                |
-----------|----------|----------|----------|----------|----------------|
All files  |      100 |      100 |      100 |      100 |                |
-----------|----------|----------|----------|----------|----------------|
```

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/map-dest/issues/new).

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2015 Jon Schlinkert
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on October 30, 2015._