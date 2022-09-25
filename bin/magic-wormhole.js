#!/usr/bin/env node
'use strict';

let fs = require('fs');
let os = require('os');
let path = require('path');
let child_process = require('child_process');

let platforms = require('../platforms.json');

// this approach to distributing binaries for multiple platforms
// was copied from esbuild:
// https://github.com/evanw/esbuild/pull/1621

function platformToPath(platform) {
  return `magic-wormhole-${platform.name}/${platform.windows ? 'magic-wormhole.exe' : 'bin/magic-wormhole'}`;
}

function getBinaryPath() {
  if (os.endianness() !== 'LE') {
    console.error(`Only little-endian platforms are currently supported. If you need a new platform, open an issue at https://github.com/bakkot/magic-wormhole-npm`);
    process.exit(1);
  }
  let platform = platforms.find(p => p.os === process.platform && p.cpu === os.arch());

  if (platform == null) {
    console.error(`Unsupported platform: ${process.platform}-${p.cpu}. If you need a new platform, open an issue at https://github.com/bakkot/magic-wormhole-npm`);
    process.exit(1);
  }

  try {
    return require.resolve(platformToPath(platform));
  } catch (e) {
    let message = `The binary for magic-wormhole-${platform.name} was not found.`;
    let foundAlternative = false;
    // check if any other versions of the binary package are installed
    for (let alt of platforms) {
      if (alt === platform) continue;
      try {
        require.resolve(platformToPath(alt));
        foundAlternative = true;
        message += `\nHowever, found binary for magic-wormhole-${alt.name}. Did you copy node_modules from another machine? That isn't supported.`;
        if (process.platform === 'darwin' && alt.os === 'darwin') {
          message += `\nOr you may have installed from within Rosetta and now tried to execute magic-wormhole from outside of it, or conversely; ensure the install and execution are running in the same environment.`;
        }
        break;
      } catch {
        // did not find `key` installed; keep looking
      }
    }
    if (!foundAlternative) {
      message += `\nDid you run with --no-optional? That isn't supported.`;
    }
    console.error(message);
    process.exit(1);
  }
}


let binaryPath = getBinaryPath();
child_process.execFileSync(binaryPath, process.argv.slice(2), { stdio: 'inherit' })
