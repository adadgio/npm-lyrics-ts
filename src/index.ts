/**
 * Index
 */
'use strict';
require('./lyrics/register');

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
        .import('AcmeBundle')
        .setWebroot(`${__dirname}/app/public`)
    ;

    // some services you might want to ini here at start up
    // and not on every request, do it here
    // app.preloadServices([]);

    // at last and only at last
    // run your app
    app.run();

    // show total boot time for debug purposes
    // can also use hrend[0] for value in seconds
    let hrend = process.hrtime(hrstart);
    Console.red(`Boot time (hr): ${(hrend[1]/1000000)}ms`);
});
