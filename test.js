import fs from 'fs';
import execa from 'execa';
import pify from 'pify';
import test from 'ava';

process.chdir(__dirname);

const fsP = pify(fs);

test('show help screen', async t => {
	t.regex(await execa.stdout('./cli.js', ['--help']), /Minify images/);
});

test('show version', async t => {
	t.is(await execa.stdout('./cli.js', ['--version']), require('./package.json').version);
});

test('optimize a GIF', async t => {
	const input = await fsP.readFile('fixtures/test.gif');

	t.true((await execa.stdout('./cli.js', {
		input,
		encoding: 'buffer'
	})).length < input.length);
});

test('optimize a JPG', async t => {
	const input = await fsP.readFile('fixtures/test.jpg');

	t.true((await execa.stdout('./cli.js', {
		input,
		encoding: 'buffer'
	})).length < input.length);
});

test('optimize a PNG', async t => {
	const input = await fsP.readFile('fixtures/test.png');

	t.true((await execa.stdout('./cli.js', {
		input,
		encoding: 'buffer'
	})).length < input.length);
});

test('optimize a SVG', async t => {
	const input = await fsP.readFile('fixtures/test.svg');

	t.true((await execa.stdout('./cli.js', {
		input,
		encoding: 'buffer'
	})).length < input.length);
});

test('output error on corrupt images', async t => {
	await t.throws(execa('./cli.js', ['fixtures/test-corrupt.jpg']));
});

test('support plugins', async t => {
	const input = await fsP.readFile('fixtures/test.png');
	const data = await execa.stdout('./cli.js', ['--plugin=pngquant'], {
		input,
		encoding: 'buffer'
	});

	const compareData = await execa.stdout('./cli.js', {
		input,
		encoding: 'buffer'
	});

	t.true(data.length < compareData.length);
});

test('error when trying to write multiple files to stdout', async t => {
	const err = await t.throws(execa('./cli.js', ['fixtures/test.{jpg,png}']));
	t.is(err.stderr.trim(), 'Cannot write multiple files to stdout, specify a `--out-dir`');
});

test('throw on missing plugins', async t => {
	const input = await fsP.readFile('fixtures/test.png');
	const err = await t.throws(execa('./cli.js', ['--plugin=unicorn'], {
		input,
		encoding: 'buffer'
	}));

	t.regex(err.stderr.toString(), /Unknown plugin: unicorn/);
});
