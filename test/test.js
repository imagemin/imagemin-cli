'use strict';
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var concatStream = require('concat-stream');
var test = require('ava');

test('show help screen', function (t) {
	t.plan(1);

	var concat = concatStream(end);
	var cp = spawn(path.join(__dirname, '../cli.js'), ['--help']);

	function end(str) {
		t.assert(/Minify images/.test(str), str);
	}

	cp.stdout.setEncoding('utf8');
	cp.stdout.pipe(concat);
});

test('show version', function (t) {
	t.plan(1);

	var concat = concatStream(end);
	var cp = spawn(path.join(__dirname, '../cli.js'), ['--version']);
	var version = require('../package.json').version;

	function end(str) {
		t.assert(str.trim() === version, str.trim());
	}

	cp.stdout.setEncoding('utf8');
	cp.stdout.pipe(concat);
});

test('optimize a GIF', function (t) {
	t.plan(2);

	var fixture = fs.readFileSync(path.join(__dirname, 'fixtures/test.gif'));
	var concat = concatStream(end);
	var cp = spawn(path.join(__dirname, '../cli.js'));

	function end(buf) {
		t.assert(buf.length < fixture.length, buf.length);
		t.assert(buf.length > 0, buf.length);
	}

	cp.stdout.pipe(concat);
	cp.stdin.end(fixture);
});

test('optimize a JPG', function (t) {
	t.plan(2);

	var fixture = fs.readFileSync(path.join(__dirname, 'fixtures/test.jpg'));
	var concat = concatStream(end);
	var cp = spawn(path.join(__dirname, '../cli.js'));

	function end(buf) {
		t.assert(buf.length < fixture.length, buf.length);
		t.assert(buf.length > 0, buf.length);
	}

	cp.stdout.pipe(concat);
	cp.stdin.end(fixture);
});

test('optimize a PNG', function (t) {
	t.plan(2);

	var fixture = fs.readFileSync(path.join(__dirname, 'fixtures/test.png'));
	var concat = concatStream(end);
	var cp = spawn(path.join(__dirname, '../cli.js'));

	function end(buf) {
		t.assert(buf.length < fixture.length, buf.length);
		t.assert(buf.length > 0, buf.length);
	}

	cp.stdout.pipe(concat);
	cp.stdin.end(fixture);
});

test('optimize a SVG', function (t) {
	t.plan(2);

	var fixture = fs.readFileSync(path.join(__dirname, 'fixtures/test.svg'));
	var concat = concatStream(end);
	var cp = spawn(path.join(__dirname, '../cli.js'));

	function end(buf) {
		t.assert(buf.length < fixture.length, buf.length);
		t.assert(buf.length > 0, buf.length);
	}

	cp.stdout.pipe(concat);
	cp.stdin.end(fixture);
});

test('output error on corrupt images', function (t) {
	t.plan(1);

	var read = fs.createReadStream(path.join(__dirname, 'fixtures/test-corrupt.jpg'));
	var concat = concatStream(end);
	var cp = spawn(path.join(__dirname, '../cli.js'));

	function end(str) {
		t.assert(/Corrupt JPEG data/.test(str), str);
	}

	cp.stderr.setEncoding('utf8');
	cp.stderr.pipe(concat);
	read.pipe(cp.stdin);
});
