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
	const buf = await fsP.readFile('fixtures/test.gif');
	t.true((await execa.stdout('./cli.js', {input: buf})).length < buf.length);
});

test('optimize a JPG', async t => {
	const buf = await fsP.readFile('fixtures/test.jpg');
	t.true((await execa.stdout('./cli.js', {input: buf})).length < buf.length);
});

test('optimize a PNG', async t => {
	const buf = await fsP.readFile('fixtures/test.png');
	t.true((await execa.stdout('./cli.js', {input: buf})).length < buf.length);
});

test('optimize a SVG', async t => {
	const buf = await fsP.readFile('fixtures/test.svg');
	t.true((await execa.stdout('./cli.js', {input: buf})).length < buf.length);
});

test('output error on corrupt images', async t => {
	t.throws(execa('./cli.js', ['fixtures/test-corrupt.jpg']));
});

test('support plugins', async t => {
	const buf = await fsP.readFile('fixtures/test.png');
	const data = await execa.stdout('./cli.js', ['--plugin=pngquant'], {input: buf});
	const compareData = await execa.stdout('./cli.js', {input: buf});
	t.true(data.length < compareData.length);
});
