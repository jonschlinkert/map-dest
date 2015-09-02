var mapDest = require('./');
console.log(mapDest('d.md', {cwd: 'a/b/c'}));
console.log(mapDest('d.md', {cwd: 'a/b/c', ext: '.html'}));
