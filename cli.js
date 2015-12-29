#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const arrify = require('arrify');
const meow = require('meow');
const getStdin = require('get-stdin');
const pathExists = require('path-exists');
const Imagemin = require('imagemin');

const cli = meow(`
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
`, {
	boolean: [
		'interlaced',
		'progressive'
	],
	string: [
		'plugin',
		'optimizationLevel',
		'install'
	],
	alias: {
		P: 'plugin',
		i: 'interlaced',
		o: 'optimizationLevel',
		p: 'progressive'
	}
});

function isFile(path) {
	if (/^[^\s]+\.\w*$/.test(path)) {
		return true;
	}

	try {
		return fs.statSync(path).isFile();
	} catch (err) {
		return false;
	}
}

const DEFAULT_PLUGINS = [
	'gifsicle',
	'jpegtran',
	'optipng',
	'svgo'
];

function run(src, dest) {
	const plugins = cli.flags.plugin ? arrify(cli.flags.plugin) : DEFAULT_PLUGINS;
	const imagemin = new Imagemin().src(src);

	plugins.forEach(name => {
		let plugin;

		switch (name) {
			case 'gifsicle':
			case 'jpegtran':
			case 'optipng':
				plugin = Imagemin[name](cli.flags);
				break;
			case 'svgo':
				plugin = Imagemin.svgo();
				break;
			default:
				try {
					plugin = require('imagemin-' + name)(cli.flags);
				} catch (err) {
					console.error([
						'Unknown plugin ' + name,
						'',
						'Maybe you forgot to install the plugin?',
						'You can install it with:',
						'  $ npm install -g imagemin-' + name
					].join('\n'));
					process.exit(1);
				}
				break;
		}

		imagemin.use(plugin);
	});

	if (dest) {
		imagemin.dest(dest);
	}

	imagemin.run((err, files) => {
		if (err) {
			console.error(err.message);
			process.exit(1);
		}

		if (!dest) {
			files.forEach(file => process.stdout.write(file.contents));
		}
	});
}

if (!cli.input.length && process.stdin.isTTY) {
	console.error([
		'Provide at least one file to optimize',
		'',
		'Example',
		'  imagemin images/* build',
		'  imagemin foo.png > foo-optimized.png',
		'  cat foo.png | imagemin > foo-optimized.png'
	].join('\n'));

	process.exit(1);
}

if (cli.input.length) {
	let src = cli.input;
	let dest;

	if (src.length > 1 && !isFile(src[src.length - 1])) {
		dest = src[src.length - 1];
		src.pop();
	}

	src = src.map(s => {
		if (!isFile(s) && pathExists.sync(s)) {
			return path.join(s, '**/*');
		}

		return s;
	});

	run(src, dest);
} else {
	getStdin.buffer().then(run);
}
