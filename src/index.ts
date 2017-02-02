/**
 * Index
 */
'use strict';
let hrstart = process.hrtime();
import { App, Cluster } from './@lyrics/core';

/**
 * Let the app use clusters
 */
let clustering = new Cluster();

clustering.start(f => {
    let app = new App();

    app
        .debug(true)
        .import('AcmeBundle') // to import all AcmeBundle/controller|service/<controllers index.ts>
    ;

    app.run();

    let hrend = process.hrtime(hrstart);
    console.info("Boot time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
});
