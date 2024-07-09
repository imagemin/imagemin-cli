# imagemin-cli

> Minify images

_Issues with the output should be reported on the `imagemin` [issue tracker](https://github.com/imagemin/imagemin/issues)._

## Install

```sh
npm install --global imagemin-cli
```

## Usage

```
$ imagemin --help

  Usage
		$ imagemin <path|glob> [options]
	  $ imagemin <path|glob> ... --out-dir=build [--plugin=<name> ...]
	  $ imagemin <file> > <output>
	  $ cat <file> | imagemin > <output>

	Options
	  --plugin, -p   Override the default plugins
	  --out-dir, -o  Output directory

	Examples
	  $ imagemin images/*
	  $ imagemin images/* --plugin.pngquant.quality={0.1,0.2} --plugin.gifsicle.quality={0.1,0.2}
	  $ imagemin images/* --out-dir=build
	  $ imagemin foo.png > foo-optimized.png
	  $ cat foo.png | imagemin > foo-optimized.png
	  $ imagemin foo.png --plugin=pngquant > foo-optimized.png
	  $ imagemin foo.png --plugin.pngquant.quality=0.1 --plugin.pngquant.quality=0.2 > foo-optimized.png
	  # Non-Windows platforms may support the short CLI syntax for array arguments
	  $ imagemin foo.png --plugin.pngquant.quality={0.1,0.2} > foo-optimized.png
	  $ imagemin foo.png --plugin.webp.quality=95 --plugin.webp.preset=icon > foo-icon.webp
```

## Related

- [imagemin](https://github.com/imagemin/imagemin) - API for this module
