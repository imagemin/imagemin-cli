import fs from 'fs';
import path from 'path';
import execa from 'execa';
import pify from 'pify';
import test from 'ava';

const fsP = pify(fs);

test('show help screen', async t => {
	t.regex(await execa.stdout('cli.js', ['--help']), /Minify images/);
});

test('show version', async t => {
	t.is(await execa.stdout('cli.js', ['--version']), require('./package.json').version);
});

test('optimize a GIF', async t => {
	const buf = await fsP.readFile(path.join(__dirname, 'fixtures', 'test.gif'));
	t.true((await execa.stdout('./cli.js', {input: buf})).length < buf.length);
});

test('optimize a JPG', async t => {
	const buf = await fsP.readFile(path.join(__dirname, 'fixtures', 'test.jpg'));
	t.true((await execa.stdout('./cli.js', {input: buf})).length < buf.length);
});

test('optimize a PNG', async t => {
	const buf = await fsP.readFile(path.join(__dirname, 'fixtures', 'test.png'));
	t.true((await execa.stdout('./cli.js', {input: buf})).length < buf.length);
});

test('optimize a SVG', async t => {
	const buf = await fsP.readFile(path.join(__dirname, 'fixtures', 'test.svg'));
	t.true((await execa.stdout('./cli.js', {input: buf})).length < buf.length);
});

test('output error on corrupt images', async t => {
	t.throws(execa('cli.js', [path.join(__dirname, 'fixtures', 'test-corrupt.jpg')]));
});
