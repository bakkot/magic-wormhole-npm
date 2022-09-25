'use strict';

let fs = require('fs');
let path = require('path');
let child_process = require('child_process');

let platforms = require('./build/magic-wormhole/platforms.json');

if (process.env.NODE_AUTH_TOKEN == null) {
  console.error('NODE_AUTH_TOKEN environment variable must be provided');
  process.exit(1);
}

let dirs = [
  'magic-wormhole',
  ...platforms.map(p => `magic-wormhole-${p.name}`),
];

for (let dir of dirs) {
  dir = path.join(__dirname, 'build', dir);
  // there has got to be a better way to do this...
  fs.writeFileSync(path.join(dir, '.npmrc'), `//registry.npmjs.org/:_authToken=\${NODE_AUTH_TOKEN}\nregistry=https://registry.npmjs.org/`, 'utf8');
  process.chdir(dir)
  child_process.execSync(`npm publish`, { stdio: 'inherit' });
}
