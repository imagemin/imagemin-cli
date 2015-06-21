# imagemin-cli [![Build Status](https://img.shields.io/travis/imagemin-cli/imagemin-cli.svg)](https://travis-ci.org/imagemin-cli/imagemin-cli)

> Minify images


## Install

```
$ npm install --global imagemin-cli
```


## Usage

```
$ imagemin --help

  Usage
    $ imagemin <file> <directory>
    $ imagemin <directory> <output>
    $ imagemin <file> > <output>
    $ cat <file> | imagemin > <output>

  Example
    $ imagemin images/* build
    $ imagemin images build
    $ imagemin foo.png > foo-optimized.png
    $ cat foo.png | imagemin > foo-optimized.png

  Options
    -i, --interlaced                    Interlace gif for progressive rendering
    -o, --optimizationLevel <number>    Optimization level between 0 and 7
    -p, --progressive                   Lossless conversion to progressive
```


## Related

- [imagemin](https://github.com/imagemin/imagemin) - API for this module


## License

MIT © [imagemin](https://github.com/imagemin)
