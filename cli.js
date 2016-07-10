#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const arrify = require('arrify');
const meow = require('meow');
const getStdin = require('get-stdin');
const imagemin = require('imagemin');
const ora = require('ora');
const plur = require('plur');
const stripIndent = require('strip-indent');

const cli = meow(`
	Usage
	  $ imagemin <path|glob> ... --out-dir=build [--plugin=<name> ...]
	  $ imagemin <file> > <output>
	  $ cat <file> | imagemin > <output>

	Options
	  -p, --plugin     Override the default plugins
	  -o, --out-dir    Output directory
	  -r, --recursive  Run the command recursively

	Examples
	  $ imagemin images/* --out-dir=build
	  $ imagemin images --recursive --out-dir=build
	  $ imagemin foo.png > foo-optimized.png
	  $ cat foo.png | imagemin > foo-optimized.png
	  $ imagemin --plugin=pngquant foo.png > foo-optimized.png
`, {
	string: [
		'plugin',
		'out-dir'
	],
	alias: {
		p: 'plugin',
		o: 'out-dir',
		r: 'recursive'
	}
});

const DEFAULT_PLUGINS = [
	'gifsicle',
	'jpegtran',
	'optipng',
	'svgo'
];

const requirePlugins = plugins => plugins.map(x => {
	try {
		return require(`imagemin-${x}`)();
	} catch (err) {
		console.error(stripIndent(`
			Unknown plugin: ${x}

			Did you forgot to install the plugin?
			You can install it with:

			  $ npm install -g imagemin-${x}
		`).trim());
		process.exit(1);
	}
});

const isDir = path => fs.lstatSync(path).isDirectory();

const run = (input, opts) => {
	if (typeof opts.recursive !== 'undefined') {
		const filtered = input.filter(input => isDir(input));
		filtered.forEach(dir => {
			// recursively run for each directory found
			const children = fs.readdirSync(dir).map(f => path.join(dir, f));
			run(children, Object.assign({}, opts, {outDir: path.join(opts.outDir, dir)}));
		});

		if (filtered.length === input.length) {
			// all inputs were folders
			return;
		}
	}

	opts = Object.assign({plugin: DEFAULT_PLUGINS}, opts);

	const use = requirePlugins(arrify(opts.plugin));
	const spinner = ora('Minifying images');

	if (Buffer.isBuffer(input)) {
		imagemin.buffer(input, {use}).then(buf => process.stdout.write(buf));
		return;
	}

	if (opts.outDir) {
		spinner.start();
	}

	imagemin(input, opts.outDir, {use})
		.then(files => {
			if (!opts.outDir && files.length === 0) {
				return;
			}

			if (!opts.outDir && files.length > 1) {
				console.error('Cannot write multiple files to stdout, specify a `--out-dir`');
				process.exit(1);
			}

			if (!opts.outDir) {
				process.stdout.write(files[0].data);
				return;
			}

			spinner.stop();

			console.log(`${files.length} ${plur('image', files.length)} minified`);
		})
		.catch(err => {
			spinner.stop();
			throw err;
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
