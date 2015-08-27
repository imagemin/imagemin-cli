#!/usr/bin/env node
'use strict';
var fs = require('fs');
var path = require('path');
var meow = require('meow');
var getStdin = require('get-stdin');
var Imagemin = require('imagemin');

var cli = meow({
	help: [
		'Usage: imagemin [OPTION]... <in-file> <out-file>',
		'  or   imagemin [OPTION]... <in-file> > <output>',
		'  or   imagemin [OPTION]... [-o output-directory] <in-file>...',
		'  or   imagemin [OPTION]... < <input> > <output>',
		'',
		'Examples',
		'  imagemin in.png out.png',
		'  imagemin images/* build',
		'  imagemin images build',
		'  imagemin foo.png > foo-optimized.png',
		'  imagemin < foo.png > foo-optimized.png',
		'  imagemin -P pngquant foo.png > foo-optimized.png',
		'',
		'Options',
		'  -p, --plugin                        override the default plugins',
		'  -o, --output                        specify the output directory',
		'      --interlaced                    interlace gif for progressive rendering',
		'      --optimization-level <number>   optimization level between 0 and 7',
		'      --progressive                   lossless conversion to progressive',
		'  -v, --verbose                       logs each file as it gets minified',
		'  -h, --help                          show this help'
	]
}, {
	boolean: [
		'interlaced',
		'progressive',
		'verbose'
	],
	string: [
		'plugin',
		'optimizationLevel',
		'install'
	],
	alias: {
		p: 'plugin',
		o: 'output',
		v: 'verbose'
	}
});

function exitWithMessage(message) {
	console.error(Array.isArray(message) ? message.join('\n') : message);
	process.exit(1);
}

var DEFAULT_PLUGINS = ['gifsicle', 'jpegtran', 'optipng', 'svgo'];
var cwd = process.cwd();

function run(src, dest, destName) {
	var plugins = cli.flags.plugin || DEFAULT_PLUGINS;
	if (!Array.isArray(plugins)) {
		plugins = [plugins];
	}

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
				// workaround pngquant bug
				var opts = {};
				for (var key in cli.flags) {
					if (name !== 'pngquant' && key !== 'verbose') {
						opts[key] = cli.flags[key];
					}
				}

				try {
					plugin = require('imagemin-' + name)(opts);
				} catch (err) {
					exitWithMessage([
						'Unknown plugin ' + name,
						'',
						'Maybe you forgot to install the plugin?',
						'You can install it with:',
						'  npm install -g imagemin-' + name
					]);
				}
				break;
		}

		imagemin.use(plugin);
	});

	var isBuffer = src instanceof Buffer;
	var useStdout = !process.stdout.isTTY
			// dest was not provided?
			&& !dest
			// src is a buffer or single file?
			&& (isBuffer || src.length === 1);

	if (!useStdout) {
		if (!dest) {
			exitWithMessage([
					'Please specify an output location.',
					'',
					'Examples:',
					'',
					'  imagemin in.png out.png',
					'  imagemin file1.png file2.png -o out'
				]);
		}

		imagemin.dest(dest);
	}

	imagemin.run(function (err, files) {
		if (err) {
			exitWithMessage(err.message);
		}

		if (useStdout) {
			files.forEach(function (file) {
				process.stdout.write(file.contents);
			});
		}
	});

	var streams = imagemin.streams;
	var srcStream = streams[0];
	var lastStream = streams[streams.length - 2];
	var files = {};
	var verbose = cli.flags.verbose;
	srcStream.on('data', function (file) {
		var originalPath = file.relative;
		if (destName) {
			file.path = path.join(path.dirname(file.path), destName);
		}

		if (verbose && file.contents) {
			files[file.relative] = {
				size: file.contents.length,
				path: originalPath
			};
		}
	});

	if (cli.flags.verbose && srcStream !== lastStream) {
		lastStream.on('data', function (file) {
			if (file.contents) {
				var relative = file.relative;
				var savings = file.contents.length / files[relative].size;
				var location = '';
				if (dest) {
					location = ' -> '
						+ path.relative(cwd, path.join(dest, relative));
				}

				console.error(files[relative].path + location
						+ ' (' + Math.round(savings * 100) + '% smaller)');
			}
		});
	}
}

if (!cli.input.length && process.stdin.isTTY) {
	exitWithMessage([
		'Provide at least one file to optimize',
		'',
		'Examples:',
		'  imagemin in.png out.png',
		'  imagemin images/* -o build',
		'  imagemin foo.png > foo-optimized.png',
		'  cat foo.png | imagemin > foo-optimized.png'
	]);
}

if (cli.input.length) {
	var files = cli.input;
	var src;
	var dest = cli.flags.output;
	var destName;
	if (!dest && files.length == 2) {
		src = [files[0]];
		dest = cwd;
		destName = files[1];
	} else {
		src = files;
	}

	src = src.map(function (s) {
			try {
				if (!fs.statSync(s).isFile()) {
					return path.join(s, '**/*');
				}
			} catch (e) {
				if (e.code == 'ENOENT') {
					console.error(s, 'does not exist');
				} else {
					console.error(e);
				}
				return undefined;
			}

			return s;
		})
		.filter(function (filename) { return filename; });

	if (!src.length) {
		exitWithMessage([
			'Provide at least one input file'
		]);
	}

	run(src, dest, destName);
} else {
	getStdin.buffer(run);
}
