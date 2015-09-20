#!/usr/bin/env node
'use strict';
var fs = require('fs');
var path = require('path');
var arrify = require('arrify');
var meow = require('meow');
var getStdin = require('get-stdin');
var pathExists = require('path-exists');
var Imagemin = require('imagemin');

var cli = meow({
	help: [
		'Usage',
		'  $ imagemin <file> <directory>',
		'  $ imagemin <directory> <output>',
		'  $ imagemin <file> > <output>',
		'  $ cat <file> | imagemin > <output>',
		'  $ imagemin [--plugin <plugin-name>...] ...',
		'',
		'Examples',
		'  $ imagemin images/* build',
		'  $ imagemin images build',
		'  $ imagemin foo.png > foo-optimized.png',
		'  $ cat foo.png | imagemin > foo-optimized.png',
		'  $ imagemin -P pngquant foo.png > foo-optimized.png',
		'',
		'Options',
		'  -P, --plugin                      Override the default plugins',
		'  -i, --interlaced                  Interlace gif for progressive rendering',
		'  -o, --optimizationLevel <number>  Optimization level between 0 and 7',
		'  -p, --progressive                 Lossless conversion to progressive'
	]
}, {
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

var DEFAULT_PLUGINS = ['gifsicle', 'jpegtran', 'optipng', 'svgo'];

function run(src, dest) {
	var plugins = cli.flags.plugin ? arrify(cli.flags.plugin) : DEFAULT_PLUGINS;
	var imagemin = new Imagemin().src(src);

	plugins.forEach(function (name) {
		var plugin;
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

	if (process.stdout.isTTY) {
		imagemin.dest(dest ? dest : 'build');
	}

	imagemin.run(function (err, files) {
		if (err) {
			console.error(err.message);
			process.exit(1);
		}

		if (!process.stdout.isTTY) {
			files.forEach(function (file) {
				process.stdout.write(file.contents);
			});
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
	var src = cli.input;
	var dest;

	if (src.length > 1 && !isFile(src[src.length - 1])) {
		dest = src[src.length - 1];
		src.pop();
	}

	src = src.map(function (s) {
		if (!isFile(s) && pathExists.sync(s)) {
			return path.join(s, '**/*');
		}

		return s;
	});

	run(src, dest);
} else {
	getStdin.buffer().then(run).catch(function (err) {
		console.error(err);
		process.exit(1);
	});
}
