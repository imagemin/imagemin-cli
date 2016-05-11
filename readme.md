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
    $ imagemin <path|glob> ... --out-dir build
    $ imagemin <file> > <output>
    $ cat <file> | imagemin > <output>
    $ imagemin [--plugin <plugin-name>...] ...

  Options
    -p, --plugin   Override the default plugins
    -o, --out-dir  Output directory

  Examples
    $ imagemin images/* --out-dir build
    $ imagemin foo.png > foo-optimized.png
    $ cat foo.png | imagemin > foo-optimized.png
    $ imagemin --plugin pngquant foo.png > foo-optimized.png
```


## Related

- [imagemin](https://github.com/imagemin/imagemin) - API for this module


## License

MIT © [imagemin](https://github.com/imagemin)
