#!/usr/bin/env node
'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const meow = require('meow');
const Path = require('path');
const fs = require('fs');

const cli = meow(`
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
`, {
	plugin: {
		type: 'string',
		alias: 'p'
	},
	outDir: {
		type: 'string',
		alias: 'o'
	}
});

const extn_check_reg_ex = new RegExp('.(png|jpg|jpeg)$');

const fileSize = async (filePath) => {
	return fs.statSync(filePath)[`size`];
};

const runBulk = async (inputs) => {
	const image_files = inputs.filter(input => extn_check_reg_ex.test(input));
	let original_size = 0;
	let compressed_size = 0;
	for (const image_file of image_files) {
		const ext = Path.extname(image_file);
		const destPath = image_file.replace(ext, '.webp');

		await exec(`node cli.js ${image_file} > ${destPath}`);

		const source_size = await fileSize(image_file);
		const dest_size = await fileSize(destPath);
		original_size += source_size;

		if (source_size < dest_size) {
			await exec(`rm ${destPath}`);
			compressed_size += source_size;
		} else {
			await exec(`rm ${image_file}`);
			compressed_size += dest_size;
		}
	}

	console.log(`size saved ${original_size - compressed_size}`);
};

if (cli.input.length === 0 && process.stdin.isTTY) {
	console.error('Specify at least one file path');
	process.exit(1);
}

(async () => {
	await runBulk(cli.input);
})();