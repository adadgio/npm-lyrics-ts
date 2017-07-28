#! /usr/bin/env node
import * as program from 'commander';

let unzip = require('unzip'),
    fse = require('fs-extra'),
    request = require('request');

// temporary downloaded zip file
let tmpzip = './var/cache/_tmp.zip';

// bundle name must be supplied as <vendor>:<CamelCase>Bundle
program
  .version('0.0.1')
  .option('-b, --bundle <bundle>', 'Bundle git identifier', /^.{3,}$/)
  .option('-r, --release <bundle>', 'Git release')
  .parse(process.argv);

// turn <vendor>:<CamelCase>Bundle into <vendor>/npm-lyrics-<CamelCase>Bundle
let githubUri = program.bundle.replace(':', '/npm-lyrics-');
let release = (!program.release) ? 'master' : program.release;
// let targetDir = `npm-lyrics-${release}`;
let uri = `https://github.com/${githubUri}/archive/${release}.zip`;

// downloads from git path github.com/<vendor>/lyrics-npm-<CamelCase>Bundle/archive/<branch|tag>.zip
console.log('Downloading from %s...', uri);
request(uri).pipe(fse.createWriteStream(tmpzip)).on('close', () => {
    console.log('Extracting and installing...');

    fse.createReadStream(tmpzip).pipe(unzip.Extract({ path: `./src/app/bundles` })).on('close', () => {
        let parts = program.bundle.split(':');
        let origin = `./src/app/bundles/npm-lyrics-${parts[1]}-${release}`;
        let dest = `./src/app/bundles/${parts[1]}`;

        fse.removeSync(dest);

        fse.move(origin, dest, { overwrite: true }, (err) => {
            if (typeof(err) !== 'undefined') { console.log(err); return; }

            fse.removeSync(origin);
            fse.unlinkSync(tmpzip);
            console.log('Ok. Bundle installed');
        });
    });

});
