#! /usr/bin/env node
import * as program from 'commander';
import * as helpers from './helpers';

const unzip = require('unzip'),
    fse = require('fs-extra'),
    chalk = require('chalk'),
    pathes = require('path'),
    request = require('request');

const log = console.log;

// nice start up stuff and coloring
log(chalk.bgBlue(`###      Lyrics CLI      ###`));
for (let i=0; i < 1; i++) { log(chalk.bgBlue(`#                          #`)) }
log(chalk.bgBlue(`############################`));
log(``);

// temporary downloaded zip file
const rootDir = process.env.PWD;
const packageFile = `${rootDir}/package.json`;
const tmpZipFile = './var/cache/_tmp.zip';
const packageInfo = require(packageFile);
const version = packageInfo.version;

if (typeof packageInfo.version === 'undefined' || null == packageInfo.version || packageInfo.version === '') {
    log(chalk.red(`$> Your ${chalk.underline.bold('package.json')} file does not contain any framework ${chalk.underline.bold('version')} information\n`));
    process.exit();
}

// bundle name must be supplied as <vendor>:<CamelCase>Bundle
program
  .version('0.0.1')
  .command('update [version]', 'Update framework to the lastest version or specific version', {isDefault: '@latest'})
  // .action((cmdName, version) => {
  //     console.log(version);
  // })
  // .option('-b, --bundle <bundle>', 'Bundle git identifier', /^.{3,}$/)
  // .option('-r, --release <bundle>', 'Git release')
  .parse(process.argv);

 console.log(program.update);
// console.log(program.update);
// if (helpers.isSetButNotValid(program.update)) {
//     log(chalk.red(`$> Invalid ${chalk.underline.bold('version')} string for the --update (-u) option\n`));
// }

// check command line arguments and decide what to do

// turn <vendor>:<CamelCase>Bundle into <vendor>/npm-lyrics-<CamelCase>Bundle
// let githubUri = program.bundle.replace(':', '/npm-lyrics-');
// let release = (!program.release) ? 'master' : program.release;
// // let targetDir = `npm-lyrics-${release}`;
// let uri = `https://github.com/${githubUri}/archive/${release}.zip`;
//
// // downloads from git path github.com/<vendor>/lyrics-npm-<CamelCase>Bundle/archive/<branch|tag>.zip
// console.log('Downloading from %s...', uri);
// request(uri).pipe(fse.createWriteStream(tmpZip)).on('close', () => {
//     console.log('Extracting and installing...');
//
//     fse.createReadStream(tmpZip).pipe(unzip.Extract({ path: `./src/app/bundles` })).on('close', () => {
//         let parts = program.bundle.split(':');
//         let origin = `./src/app/bundles/npm-lyrics-${parts[1]}-${release}`;
//         let dest = `./src/app/bundles/${parts[1]}`;
//
//         fse.removeSync(dest);
//
//         fse.move(origin, dest, { overwrite: true }, (err) => {
//             if (typeof(err) !== 'undefined') { console.log(err); return; }
//
//             fse.removeSync(origin);
//             fse.unlinkSync(tmpZip);
//             console.log('Ok. Bundle installed');
//         });
//     });
//
// });
