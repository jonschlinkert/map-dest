var mapDest = require('./');
console.log(mapDest('d.md', {
  cwd: 'a/b/c'
}));
console.log(mapDest('d.md', {
  cwd: 'a/b/c',
  ext: '.html'
}));
console.log(mapDest('templates/base.hbs', {
  cwd: '@/boilerplate-h5bp'
}));
console.log(mapDest('scaffolds', {
  cwd: '~'
}));

console.log(mapDest('.', {
  srcBase: 'scaffolds',
  cwd: '~'
}));
