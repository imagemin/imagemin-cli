#!/usr/bin/env node
'use strict';
const arrify = require('arrify');
const meow = require('meow');
const getStdin = require('get-stdin');
const imagemin = require('imagemin');
const ora = require('ora');
const plur = require('plur');
const stripIndent = require('strip-indent');
const fs = require('fs')
const path = require('path')

const cli = meow(`
    /** will minify and override all the existing images in all subfolders **/

	Usage
	  $ imagemin <path|glob> [--plugin=<name> ...]
	  $ cat <file> | imagemin > <output>

	Examples
	  $ imagemin images/*
	  

`, {
    string: [
        'plugin',
    ],
    alias: {
        p: 'plugin',
    }
});

const DEFAULT_PLUGINS = [
    'gifsicle',
    'jpegtran',
    'optipng',
    'svgo'
];

const requirePlugins = plugins => plugins.map(x => {
    try {
        return require(`imagemin-${x}`)();
    } catch (err) {
        console.error(stripIndent(`
			Unknown plugin: ${x}

			Did you forgot to install the plugin?
			You can install it with:

			  $ npm install -g imagemin-${x}
		`).trim());
        process.exit(1);
    }
});

const run = (input, opts) => {
    opts = Object.assign({plugin: DEFAULT_PLUGINS}, opts);

    const use = requirePlugins(arrify(opts.plugin));
    const spinner = ora('Minifying images');

    let getAllDirectories = srcpath => {
        let directories = [srcpath]
        let getDirectories = srcpath => {
            let folders = fs.readdirSync(srcpath).filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
            if (folders.length !== 0) {
                for (let i = 0; i < folders.length; i++) {
                    directories.push(srcpath + '/' + folders[i])
                    getDirectories(srcpath + '/' + folders[i])
                }
            }
        }
        getDirectories(srcpath)
        return directories
    }
    let dirs = getAllDirectories(input[0]);

    for (let i=0; i < dirs.length; i++) {
        spinner.start();

        input = [dirs[i]+'/*']
        if (Buffer.isBuffer(input)) {
            imagemin.buffer(input, {use}).then(buf => process.stdout.write(buf));
            return;
        }
        imagemin(input, dirs[i], {use})
            .then(files => {
                if (!dirs[i] && files.length === 0) {
                    return;
                }

                if (!dirs[i] && files.length > 1) {
                    console.error('Cannot write multiple files to stdout');
                    process.exit(1);
                }

                if (!dirs[i]) {
                    process.stdout.write(files[0].data);
                    return;
                }

                spinner.stop();
                console.log(`${files.length} ${plur('image', files.length)} minified in ${dirs[i]}`);
            })
            .catch(err => {
                spinner.stop();
                throw err;
            });
    }
};

if (!cli.input.length && process.stdin.isTTY) {
    console.error('Specify at least one filename');
    process.exit(1);
}

if (cli.input.length) {
    run(cli.input, cli.flags);
} else {
    getStdin.buffer().then(buf => run(buf, cli.flags));
}
