# imagemin-cli [![Build Status](https://travis-ci.org/imagemin/imagemin-cli.svg?branch=master)](https://travis-ci.org/imagemin/imagemin-cli)

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
    $ imagemin --plugin=pngquant foo.png > foo-optimized.png
```


## Related

- [imagemin](https://github.com/imagemin/imagemin) - API for this module
