/**
 * Index
 */
'use strict';
import { App, Cluster } from './@lyrics/core';
import { TestService } from './app/service/test-service';

/**
 * Let the app use clusters
 */
let clustering = new Cluster();

clustering.start(f => {
    let app = new App();

    app.register('test.service', TestService);
    // app.setWebRoot('www');

    app.run();
});
