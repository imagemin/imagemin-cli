import {promisify} from 'util';
import fs from 'fs';
import execa from 'execa';
import test from 'ava';

process.chdir(__dirname);

const readFile = promisify(fs.readFile);

test('show version', async t => {
	const {stdout} = await execa('./cli.js', ['--version']);
	t.is(stdout, require('./package.json').version);
});

test('optimize a GIF', async t => {
	const input = await readFile('fixtures/test.gif');

	const {stdout} = await execa('./cli.js', {
		input,
		encoding: 'buffer'
	});

	t.true(stdout.length < input.length);
});

test('optimize a JPG', async t => {
	const input = await readFile('fixtures/test.jpg');

	const {stdout} = await execa('./cli.js', {
		input,
		encoding: 'buffer'
	});

	t.true(stdout.length < input.length);
});

test('optimize a PNG', async t => {
	const input = await readFile('fixtures/test.png');

	const {stdout} = await execa('./cli.js', {
		input,
		encoding: 'buffer'
	});

	t.true(stdout.length < input.length);
});

test('optimize a SVG', async t => {
	const input = await readFile('fixtures/test.svg');

	const {stdout} = await execa('./cli.js', {
		input,
		encoding: 'buffer'
	});

	t.true(stdout.length < input.length);
});

test('output error on corrupt images', async t => {
	await t.throwsAsync(execa('./cli.js', ['fixtures/test-corrupt.jpg']));
});

test('support plugins', async t => {
	const input = await readFile('fixtures/test.png');

	const {stdout: data} = await execa('./cli.js', ['--plugin=pngquant'], {
		input,
		encoding: 'buffer'
	});

	const {stdout: compareData} = await execa('./cli.js', {
		input,
		encoding: 'buffer'
	});

	t.true(data.length < compareData.length);
});

test('error when trying to write multiple files to stdout', async t => {
	const error = await t.throwsAsync(execa('./cli.js', ['fixtures/test.{jpg,png}']));
	t.is(error.stderr.trim(), 'Cannot write multiple files to stdout, specify `--out-dir`');
});

test('throw on missing plugins', async t => {
	const input = await readFile('fixtures/test.png');
	const error = await t.throwsAsync(execa('./cli.js', ['--plugin=unicorn'], {
		input,
		encoding: 'buffer'
	}));

	t.regex(error.stderr.toString(), /Unknown plugin: unicorn/);
});

test('support plugin options', async t => {
	const input = await readFile('fixtures/test.png');

	const {stdout: data} = await execa('./cli.js', ['--plugin.pngquant.dithering=1'], {
		input,
		encoding: 'buffer'
	});

	const {stdout: compareData} = await execa('./cli.js', {
		input,
		encoding: 'buffer'
	});

	t.true(data.length < compareData.length);
});
