/**
 * Index
 */
'use strict';
// use npm module alias to use ts paths mapping (tsconfig.json)
// and correct nodejs alias resolver (package.json)
require('module-alias/register');

let hrstart = process.hrtime();
import { App, Cluster, Console } from '@lyrics/core';

/**
 * Let the app use clusters
 */
let clustering = new Cluster();

clustering.start(f => {
    let app = new App();

    app
        .debug(true)
        .import('SystemBundle')
        .import('AcmeBundle')
        .setWebroot(`${__dirname}/app/public`)
    ;

    app.run();

    // show total boot time for debug purposes
    // can also use hrend[0] for value in seconds
    let hrend = process.hrtime(hrstart);
    Console.red(`Boot time (hr): ${(hrend[1]/1000000)}ms`);
});
