# imagemin-cli [![Build Status](https://travis-ci.com/imagemin/imagemin-cli.svg?branch=master)](https://travis-ci.com/github/imagemin/imagemin-cli)

> Minify images

*Issues with the output should be reported on the `imagemin` [issue tracker](https://github.com/imagemin/imagemin/issues).*

## Install

```
$ npm install --global imagemin-cli
```

## Usage

```
$ imagemin --help

  Usage
    $ imagemin <path|glob> ... --out-dir=build [--plugin=<name> ...]
    $ imagemin <file> > <output>
    $ cat <file> | imagemin > <output>

  Options
    --plugin, -p   Override the default plugins
    --out-dir, -o  Output directory

  Examples
    $ imagemin images/* --out-dir=build
    $ imagemin foo.png > foo-optimized.png
    $ cat foo.png | imagemin > foo-optimized.png
    $ imagemin foo.png --plugin=pngquant > foo-optimized.png
    $ imagemin foo.png --plugin.pngquant.quality={.5,1} > foo-optimized.png
    $ imagemin foo.png --plugin.webp.quality=95 --plugin.webp.preset=icon > foo-icon.webp
```
⚠️ To pass an argument as a number in `[0, 1]` range trim the first digit: `--param=0.05` → `--param=.05`

## Related

- [imagemin](https://github.com/imagemin/imagemin) - API for this module
