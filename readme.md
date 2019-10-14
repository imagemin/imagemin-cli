# imagemin-cli [![Build Status](https://travis-ci.org/imagemin/imagemin-cli.svg?branch=master)](https://travis-ci.org/imagemin/imagemin-cli)

> Minify images

---

<div align="center">
	<sup>Gumlet is helping make open source sustainable by sponsoring Sindre Sorhus.</sup>
	<a href="https://www.gumlet.com">
		<div>
			<img src="https://sindresorhus.com/assets/thanks/gumlet-logo.svg" width="300"/>
		</div>
		<sup><b>Optimised Image Delivery made simple</b></sup>
	</a>
</div>

---

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
    $ imagemin --plugin.pngquant.quality={0.1,0.2} foo.png > foo-optimized.png
    $ imagemin --plugin.webp.quality=95 --plugin.webp.preset=icon foo.png > foo-icon.webp
```


## Related

- [imagemin](https://github.com/imagemin/imagemin) - API for this module
