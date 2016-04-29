#!/usr/bin/env node
'use strict';
const arrify = require('arrify');
const meow = require('meow');
const getStdin = require('get-stdin');
const imagemin = require('imagemin');
const stripIndent = require('strip-indent');

const cli = meow(`
	Usage
	  $ imagemin <path|glob> ... --out-dir build
	  $ imagemin <file> > <output>
	  $ cat <file> | imagemin > <output>
	  $ imagemin [--plugin <plugin-name>...] ...

	Options
	  -O, --optimizationLevel <number>  Optimization level between 0 and 7
	  -P, --plugin                      Override the default plugins
	  -i, --interlaced                  Interlace gif for progressive rendering
	  -o, --out-dir                     Output directory
	  -p, --progressive                 Lossless conversion to progressive

	Examples
	  $ imagemin images/* --out-dir build
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
		'out-dir',
		'install'
	],
	alias: {
		O: 'optimizationLevel',
		P: 'plugin',
		i: 'interlaced',
		o: 'out-dir',
		p: 'progressive'
	}
});

const DEFAULT_PLUGINS = [
	'gifsicle',
	'jpegtran',
	'optipng',
	'svgo'
];

const requirePlugins = (plugins, opts) => plugins.map(x => {
	try {
		x = require(`imagemin-${x}`)(opts);
	} catch (err) {
		console.error(stripIndent(`
			Unknown plugin: ${x}

			Did you forgot to install the plugin?
			You can install it with:

			  $ npm install -g imagemin-${x}
		`).trim());
		process.exit(1);
	}

	return x;
});

const run = (input, opts) => {
	const plugins = opts.plugin ? arrify(opts.plugin) : DEFAULT_PLUGINS;

	if (Buffer.isBuffer(input)) {
		return imagemin.buffer(input, {use: requirePlugins(plugins, opts)}).then(buf => process.stdout.write(buf));
	}

	imagemin(input, opts.outDir, {use: requirePlugins(plugins, opts)}).then(files => {
		if (!opts.outDir) {
			files.forEach(x => process.stdout.write(x.data));
		}
	});
};

if (!cli.input.length && process.stdin.isTTY) {
	console.error('Specify at least one filename');
	process.exit(1);
}

if (cli.input.length) {
	run(cli.input, cli.flags);
} else {
	getStdin.buffer().then(buf => run(buf, cli.flags));
}
