/**
 * Index
 */
'use strict';
let hrstart = process.hrtime();
import { App, Cluster } from './@lyrics/core';
import { TestService, OtherService, PdfService } from './app/service';

/**
 * Let the app use clusters
 */
let clustering = new Cluster();

clustering.start(f => {
    let app = new App();

    app.debug(true);
    app.register('test.service', TestService);
    app.register('other.service', OtherService);
    app.register('pdf.service', PdfService);

    app.run();

    let hrend = process.hrtime(hrstart);
    console.info("Boot time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
});
