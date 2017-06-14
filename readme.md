
# This is a fork of imagemin-cli [![Build Status](https://travis-ci.org/imagemin/imagemin-cli.svg?branch=master)](https://travis-ci.org/imagemin/imagemin-cli) for a specific use

> Minify and recursive override all the existing images in all subfolders


## Install

```
$ npm install --global soleromel/imagemin-cli-recursive
```


## Usage

```
$ imagemin --help

  Usage
    $ imagemin <path|glob> [--plugin=<name> ...]
    $ cat <file> | imagemin > <output>

  Options
    -p, --plugin   Override the default plugins
    -o, --out-dir  Output directory

  Examples
    $ imagemin images/* --out-dir=build
    $ imagemin foo.png > foo-optimized.png
    $ cat foo.png | imagemin > foo-optimized.png
    $ imagemin --plugin=pngquant foo.png > foo-optimized.png
```


## Related

- [imagemin](https://github.com/imagemin/imagemin) - API for this module
- [imagemin-cli](https://github.com/imagemin/imagemin-cli) - Original module of this Fork


## License

MIT © [imagemin](https://github.com/imagemin)
