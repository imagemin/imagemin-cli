import fs from 'fs';
import path from'path';
import {spawn} from 'child_process';
import concatStream from 'concat-stream';
import test from 'ava';

const cliPath = path.join(__dirname, '../cli.js');

test('show help screen', t => {
	const cp = spawn(cliPath, ['--help']);

	cp.stdout.setEncoding('utf8');
	cp.stdout.pipe(concatStream(str => {
		t.regexTest(/Minify images/, str);
		t.end();
	}));
});

test('show version', t => {
	const cp = spawn(cliPath, ['--version']);
	const version = require('../package.json').version;

	cp.stdout.setEncoding('utf8');
	cp.stdout.pipe(concatStream(str => {
		t.is(str.trim(), version);
		t.end();
	}));
});

test('optimize a GIF', t => {
	const fixture = fs.readFileSync(path.join(__dirname, 'fixture', 'test.gif'));
	const cp = spawn(cliPath);

	cp.stdout.pipe(concatStream(buf => {
		t.ok(buf.length < fixture.length);
		t.ok(buf.length > 0);
		t.end();
	}));

	cp.stdin.end(fixture);
});

test('optimize a JPG', t => {
	const fixture = fs.readFileSync(path.join(__dirname, 'fixture', 'test.jpg'));
	const cp = spawn(cliPath);

	cp.stdout.pipe(concatStream(buf => {
		t.ok(buf.length < fixture.length);
		t.ok(buf.length > 0);
		t.end();
	}));

	cp.stdin.end(fixture);
});

test('optimize a PNG', t => {
	const fixture = fs.readFileSync(path.join(__dirname, 'fixture', 'test.png'));
	const cp = spawn(cliPath);

	cp.stdout.pipe(concatStream(buf => {
		t.ok(buf.length < fixture.length);
		t.ok(buf.length > 0);
		t.end();
	}));

	cp.stdin.end(fixture);
});

test('optimize a SVG', t => {
	const fixture = fs.readFileSync(path.join(__dirname, 'fixture', 'test.svg'));
	const cp = spawn(cliPath);

	cp.stdout.pipe(concatStream(buf => {
		t.ok(buf.length < fixture.length);
		t.ok(buf.length > 0);
		t.end();
	}));

	cp.stdin.end(fixture);
});

test('output error on corrupt images', t => {
	const read = fs.createReadStream(path.join(__dirname, 'fixture', 'test-corrupt.jpg'));
	const cp = spawn(cliPath);

	cp.stderr.setEncoding('utf8');

	cp.stderr.pipe(concatStream(str => {
		t.assert(/Corrupt JPEG data/.test(str), str);
		t.end();
	}));

	read.pipe(cp.stdin);
});
