# magic-wormhole-npm

This is an npm package which provides easy access to [magic-wormhole](https://magic-wormhole.readthedocs.io/en/latest/), using binaries from [the Go implementation](https://github.com/psanford/wormhole-william) (wormhole-william).

## Use

If you have a recent (≥ 7) version of `npm` installed, you should be able to run `npx magic-wormhole` on any supported platform to run magic-wormhole. For example, `npx magic-wormhole send foo.zip` will prepare `foo.zip` to be sent. See the [magic-wormhole docs](https://magic-wormhole.readthedocs.io/en/latest/) for more about magic-wormhole.

## Details

Each supported platform has a seperate npm package which specifies os/cpu it supports in its `package.json`. All such packages are listed as optional dependencies of this package. Assuming you're using a recent version of `npm`, it should download only the dependency which matches your platform, and [the shim](./bin/magic-wormhole) will execute it.

This approach was copied from [esbuild](https://github.com/evanw/esbuild/pull/1621), though esbuild goes to considerably greater lengths to support unusual situations.

## Building this project

You'll need to have `node` and `go` installed, and you will need [wormhole-william](https://github.com/psanford/wormhole-william) cloned to a _sibling_ of this directory (or modify the `WILLIAM_DIR` variable in [build.js](./build.js).

Then run `node build.js` to build everything. That will create `package.json` and `platforms.json` in this directory, and a `build/` subdirectory containing all the various per-platform packages.
