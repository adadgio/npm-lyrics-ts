/**
 * Index
 */
'use strict';
let hrstart = process.hrtime();
import { App, Cluster, Console } from './@lyrics/core';

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
    Console.info(`Boot time (hr): ${(hrend[1]/1000000)}ms`);
});
