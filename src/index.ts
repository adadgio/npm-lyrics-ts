/**
 * Index
 */
'use strict';
import { App, Cluster } from './@lyrics/core';
import { TestService, OtherService } from './app/service';

/**
 * Let the app use clusters
 */
let clustering = new Cluster();

clustering.start(f => {
    let app = new App();
    
    app.debug(true);
    app.register('test.service', TestService);
    app.register('other.service', OtherService);

    app.run();
});
