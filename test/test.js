import fs from 'fs';
import path from 'path';
import execa from 'execa';
import pify from 'pify';
import test from 'ava';

const fsP = pify(fs);
const cliPath = path.join(__dirname, '../cli.js');

test('show help screen', async t => {
	t.regex(await execa.stdout(cliPath, ['--help']), /Minify images/);
});

test('show version', async t => {
	t.is(await execa.stdout(cliPath, ['--version']), require('../package.json').version);
});

test('optimize a GIF', async t => {
	const buf = await fsP.readFile(path.join(__dirname, 'fixture', 'test.gif'));
	t.true((await execa.stdout(cliPath, {input: buf})).length < buf.length);
});

test('optimize a JPG', async t => {
	const buf = await fsP.readFile(path.join(__dirname, 'fixture', 'test.jpg'));
	t.true((await execa.stdout(cliPath, {input: buf})).length < buf.length);
});

test('optimize a PNG', async t => {
	const buf = await fsP.readFile(path.join(__dirname, 'fixture', 'test.png'));
	t.true((await execa.stdout(cliPath, {input: buf})).length < buf.length);
});

test('optimize a SVG', async t => {
	const buf = await fsP.readFile(path.join(__dirname, 'fixture', 'test.svg'));
	t.true((await execa.stdout(cliPath, {input: buf})).length < buf.length);
});

test('output error on corrupt images', async t => {
	t.throws(execa(cliPath, [path.join(__dirname, 'fixture', 'test-corrupt.jpg')]));
});
