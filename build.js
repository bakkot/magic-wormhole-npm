'use strict';

let fs = require('fs');
let path = require('path');
let child_process = require('child_process');

let version = '1.0.6-ad51cf3';

let platforms = [
  {
    name: 'mac-intel',
    tag: 'Intel macOS',
    os: 'darwin',
    cpu: 'x64',
    goEnv: { GOOS: 'darwin', GOARCH: 'amd64' },
    windows: false,
  },
  {
    name: 'mac-arm',
    tag: 'ARM macOS',
    os: 'darwin',
    cpu: 'arm64',
    goEnv: { GOOS: 'darwin', GOARCH: 'arm64' },
    windows: false,
  },
  {
    name: 'linux-x64',
    tag: 'Linux x64',
    os: 'linux',
    cpu: 'x64',
    goEnv: { GOOS: 'linux', GOARCH: 'amd64' },
    windows: false,
  },
  {
    name: 'linux-arm64',
    tag: 'Linux arm64',
    os: 'linux',
    cpu: 'arm64',
    goEnv: { GOOS: 'linux', GOARCH: 'arm64' },
    windows: false,
  },
  {
    name: 'freebsd-x64',
    tag: 'FreeBSD x64',
    os: 'freebsd',
    cpu: 'x64',
    goEnv: { GOOS: 'freebsd', GOARCH: 'amd64' },
    windows: false,
  },
  {
    name: 'freebsd-arm64',
    tag: 'FreeBSD arm64',
    os: 'freebsd',
    cpu: 'arm64',
    goEnv: { GOOS: 'freebsd', GOARCH: 'arm64' },
    windows: false,
  },
  {
    name: 'windows-x86',
    tag: 'Windows 32-bit',
    os: 'win32',
    cpu: 'ia32',
    goEnv: { GOOS: 'windows', GOARCH: '386' },
    windows: true,
  },
  {
    name: 'windows-x64',
    tag: 'Windows x64',
    os: 'win32',
    cpu: 'x64',
    goEnv: { GOOS: 'windows', GOARCH: 'amd64' },
    windows: true,
  },
  {
    name: 'windows-arm64',
    tag: 'Windows arm64',
    os: 'win32',
    cpu: 'arm64',
    goEnv: { GOOS: 'windows', GOARCH: 'arm64' },
    windows: true,
  },
];

let packageJson = {
  name: 'magic-wormhole',
  version,
  description: 'magic-wormhole packaged for distribution with npm',
  repository: 'https://github.com/bakkot/magic-wormhole-npm',
  license: 'MIT',
  bin: {
    'magic-wormhole': 'bin/magic-wormhole.js',
  },
  files: [
    'bin',
    'platforms.json',
  ],
  optionalDependencies: {
    // populated in loop below
  },
};

const WILLIAM_DIR = path.join(__dirname, '../wormhole-william');

let makeReadme = tag => `# magic-wormhole npm package for ${tag}

This is an npm package containing a binary for [magic-wormhole](https://magic-wormhole.readthedocs.io/en/latest/), built from [the Go implementation](https://github.com/psanford/wormhole-william) (wormhole-william) for ${tag}.

It is UNOFFICIAL: it is not associated with either the main magic-wormhole project or with wormhole-william.

See [the magic-wormhole-npm project](https://github.com/bakkot/magic-wormhole-npm) for details.
`;

for (let { name, tag, os, cpu, goEnv, windows } of platforms) {
  console.log(`building ${name}`);
  packageJson.optionalDependencies[`magic-wormhole-${name}`] = packageJson.version;
  let dir = path.join(__dirname, 'build', `magic-wormhole-${name}`);
  fs.mkdirSync(dir, { recursive: true });
  if (!windows) {
    fs.mkdirSync(path.join(dir, 'bin'), { recursive: true });
  }
  let bin = windows ? 'magic-wormhole.exe' : 'bin/magic-wormhole';
  let projJson = {
    name: `magic-wormhole-${name}`,
    version,
    description: `magic-wormhole binary for ${tag}`,
    repository: packageJson.repository,
    license: packageJson.license,
    files: [bin],
    os: [os],
    cpu: [cpu],
  };
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(projJson, null, 2));
  fs.writeFileSync(path.join(dir, 'README.md'), makeReadme(tag));
  process.chdir(WILLIAM_DIR);
  let binName = `magic-wormhole-${name}${windows ? '.exe' : ''}`;
  child_process.execSync(`go build -trimpath -o ${binName}`, { stdio: 'inherit', env: { ...process.env, ...goEnv } });
  process.chdir(__dirname);
  fs.copyFileSync(path.join(WILLIAM_DIR, binName), path.join(dir, bin));
}

let mainDir = path.join(__dirname, 'build/magic-wormhole');
fs.mkdirSync(path.join(mainDir, 'bin'), { recursive: true });
fs.writeFileSync(path.join(mainDir, 'package.json'), JSON.stringify(packageJson, null, 2));
fs.writeFileSync(path.join(mainDir, 'platforms.json'), JSON.stringify(platforms, null, 2));
fs.copyFileSync(path.join(__dirname, 'README.md'), path.join(mainDir, 'README.md'));
fs.copyFileSync(path.join(__dirname, 'bin/magic-wormhole.js'), path.join(mainDir, 'bin/magic-wormhole.js'));
