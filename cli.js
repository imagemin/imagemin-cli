#!/usr/bin/env node
'use strict';
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
	  --plugin, -p   Override the default plugins
	  --out-dir, -o  Output directory
	  --options,     JSON-formatted imagemin options.

	Examples
	  $ imagemin images/* --out-dir=build
	  $ imagemin foo.png > foo-optimized.png
	  $ cat foo.png | imagemin > foo-optimized.png
	  $ imagemin --plugin=pngquant foo.png > foo-optimized.png
	  $ imagemin --options='{"plugins": [["webp", {"quality": 95}]]}' foo.png > foo.webp
`, {
	flags: {
		plugin: {
			type: 'string',
			alias: 'p',
			default: ['gifsicle', 'jpegtran', 'optipng', 'svgo']
		},
		outDir: {
			type: 'string',
			alias: 'o'
		},
		options: {
			type: 'string'
		}
	}

});

const requirePlugin = (plugin, opts = {}) => {
	try {
		if (Array.isArray(plugin)) {
			return requirePlugin(plugin[0], plugin[1]);
		}

		return require(`imagemin-${plugin}`)(opts);
	} catch (_) {
		console.error(stripIndent(`
			Unknown plugin: ${plugin}

			Did you forget to install the plugin?
			You can install it with:

			  $ npm install -g imagemin-${plugin}
		`).trim());

		process.exit(1);
	}
};

const requirePlugins = plugins => plugins.map(requirePlugin);

const parseOptions = options => {
	try {
		return options ? JSON.parse(options) : {};
	} catch (error) {
		console.error(stripIndent(`
			'--options' should be valid JSON value.

			See example at https://github.com/imagemin/imagemin#usage
		`).trim());

		process.exit(1);
	}
};

const run = async (input, {outDir, plugin, options} = {}) => {
	const opts = parseOptions(options);
	const plugins = requirePlugins(opts.plugins || arrify(plugin));
	const spinner = ora('Minifying images');

	if (Buffer.isBuffer(input)) {
		process.stdout.write(await imagemin.buffer(input, {plugins}));
		return;
	}

	if (outDir) {
		spinner.start();
	}

	let files;
	try {
		files = await imagemin(input, {destination: outDir, ...opts, plugins});
	} catch (error) {
		spinner.stop();
		throw error;
	}

	if (!outDir && files.length === 0) {
		return;
	}

	if (!outDir && files.length > 1) {
		console.error('Cannot write multiple files to stdout, specify `--out-dir`');
		process.exit(1);
	}

	if (!outDir) {
		process.stdout.write(files[0].data);
		return;
	}

	spinner.stop();

	console.log(`${files.length} ${plur('image', files.length)} minified`);
};

if (cli.input.length === 0 && process.stdin.isTTY) {
	console.error('Specify at least one file path');
	process.exit(1);
}

(async () => {
	if (cli.input.length > 0) {
		await run(cli.input, cli.flags);
	} else {
		await run(await getStdin.buffer(), cli.flags);
	}
})();

