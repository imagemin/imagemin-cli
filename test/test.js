import fs from 'fs';
import path from'path';
import {spawn} from 'child_process';
import concatStream from 'concat-stream';
import test from 'ava';

const cliPath = path.join(__dirname, '../cli.js');

test('show help screen', t => {
	var cp = spawn(cliPath, ['--help']);

	cp.stdout.setEncoding('utf8');
	cp.stdout.pipe(concatStream(str => {
		t.regexTest(/Minify images/, str);
		t.end();
	}));
});

test('show version', t => {
	var cp = spawn(cliPath, ['--version']);
	var version = require('../package.json').version;

	cp.stdout.setEncoding('utf8');
	cp.stdout.pipe(concatStream(str => {
		t.is(str.trim(), version);
		t.end();
	}));
});

test('optimize a GIF', t => {
	var fixture = fs.readFileSync(path.join(__dirname, 'fixture', 'test.gif'));
	var cp = spawn(cliPath);

	cp.stdout.pipe(concatStream(buf => {
		t.ok(buf.length < fixture.length);
		t.ok(buf.length > 0);
		t.end();
	}));

	cp.stdin.end(fixture);
});

test('optimize a JPG', t => {
	var fixture = fs.readFileSync(path.join(__dirname, 'fixture', 'test.jpg'));
	var cp = spawn(cliPath);

	cp.stdout.pipe(concatStream(buf => {
		t.ok(buf.length < fixture.length);
		t.ok(buf.length > 0);
		t.end();
	}));

	cp.stdin.end(fixture);
});

test('optimize a PNG', t => {
	var fixture = fs.readFileSync(path.join(__dirname, 'fixture', 'test.png'));
	var cp = spawn(cliPath);

	cp.stdout.pipe(concatStream(buf => {
		t.ok(buf.length < fixture.length);
		t.ok(buf.length > 0);
		t.end();
	}));

	cp.stdin.end(fixture);
});

test('optimize a SVG', t => {
	var fixture = fs.readFileSync(path.join(__dirname, 'fixture', 'test.svg'));
	var cp = spawn(cliPath);

	cp.stdout.pipe(concatStream(buf => {
		t.ok(buf.length < fixture.length);
		t.ok(buf.length > 0);
		t.end();
	}));

	cp.stdin.end(fixture);
});

test('output error on corrupt images', t => {
	var read = fs.createReadStream(path.join(__dirname, 'fixture', 'test-corrupt.jpg'));
	var cp = spawn(cliPath);

	cp.stderr.setEncoding('utf8');

	cp.stderr.pipe(concatStream(str => {
		t.assert(/Corrupt JPEG data/.test(str), str);
		t.end();
	}));

	read.pipe(cp.stdin);
});
