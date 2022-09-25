# magic-wormhole-npm

[magic-wormhole](https://magic-wormhole.readthedocs.io/en/latest/) is a project to let you send files easily and securely between computers.

This is an npm package which provides easy access to magic-wormhole, using binaries from [the Go implementation](https://github.com/psanford/wormhole-william) (wormhole-william).

This project is UNOFFICIAL: it is not associated with either the main magic-wormhole project or with wormhole-william.

## Use

Running `npx magic-wormhole send file.zip` will prepare `file.zip` to be sent, and will print a "wormhole code" like `7-crossover-clockwork`.

Running `npx magic-wormhole recv 7-crossover-clockwork` (using the code printed out by the previous command) on a different computer will then download that file. No coordination beyond the code is necessary.

This requires a recent version (≥ 7) of `npm` to be installed. If you don't already have `npm` installed, you will probably find it easier to download a binary from [wormhole-william](https://github.com/psanford/wormhole-william) directly.

This project can interoperate with magic-wormhole and wormhole-william, so if one computer already has one of those set up, you don't need to use this package on that machine.

## Details

Each supported platform has a seperate npm package which specifies os/cpu it supports in its `package.json`. All such packages are listed as optional dependencies of this package. Assuming you're using a recent version of `npm`, it should download only the dependency which matches your platform, and [the shim](./bin/magic-wormhole) will execute it.

This approach was copied from [esbuild](https://github.com/evanw/esbuild/pull/1621), though esbuild goes to considerably greater lengths to support unusual situations.

## Building this project

You'll need to have `node` and `go` installed, and you will need [wormhole-william](https://github.com/psanford/wormhole-william) cloned to a _sibling_ of this directory (or modify the `WILLIAM_DIR` variable in [build.js](./build.js).

Then run `node build.js` to build everything. That will create `package.json` and `platforms.json` in this directory, and a `build/` subdirectory containing all the various per-platform packages.
