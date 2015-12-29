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
    $ imagemin <file> <directory>
    $ imagemin <directory> <output>
    $ imagemin <file> > <output>
    $ cat <file> | imagemin > <output>
    $ imagemin [--plugin <plugin-name>...] ...

  Options
    -P, --plugin                      Override the default plugins
    -i, --interlaced                  Interlace gif for progressive rendering
    -o, --optimizationLevel <number>  Optimization level between 0 and 7
    -p, --progressive                 Lossless conversion to progressive

  Examples
    $ imagemin images/* build
    $ imagemin images build
    $ imagemin foo.png > foo-optimized.png
    $ cat foo.png | imagemin > foo-optimized.png
    $ imagemin -P pngquant foo.png > foo-optimized.png
```


## Related

- [imagemin](https://github.com/imagemin/imagemin) - API for this module


## License

MIT © [imagemin](https://github.com/imagemin)
