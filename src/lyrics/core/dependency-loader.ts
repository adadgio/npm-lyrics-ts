/**
 * Ts loader component, requires barrels for
 * controllers, services and models in each bundle
 * and let typescript analyse it
 */
import * as fs      from 'fs';
import * as pathes  from 'path';
import { Console }  from '@lyrics/core';

class DependencyLoaderSingleton {

    private basepath: string;
    private lookupDirs: Array<string>;

    constructor()
    {
        this.lookupDirs = [ 'controller', 'service', 'model' ];
    }

    /**
     * Loop through bundle modles, services and models.
     * The purpose here is that typescript reads these
     * files mainly for meta data analysis (see app.ts)
     * Folders (/controller, /model, /service) must have index.ts files.
     */
    public readBundles(bundle: string)
    {
        let bundleBasepath = `./../../app/bundles/${bundle}`;

        let srvcsPath = `${bundleBasepath}/service`,
            ctrlsPath = `${bundleBasepath}/controller`,
            modelsPath = `${bundleBasepath}/model`;

        // load all controllers from AcmeBundle/controller/index.ts
        // there is nothing to do afterwards, typescript will read
        // controllers annotations and router bridge then know that
        // it will need to create instances at build time
        let controllers = this.require(ctrlsPath);

        // register all services in the container
        // from AcmeBundle/service/index.ts
        let services = this.require(srvcsPath);

        // let typescript read models
        // from AcmeBundle/modle/index.ts
        let models = this.require(modelsPath);

        return {
            controllers: controllers,
            services: services,
            models: models,
        }
    }

    /**
     * Set service name and prototype into the container
     */
    public require(path: string)
    {
        let deps: any = null;
        let basename = pathes.basename(path);
        let shortpath = path.replace('./../../', '');
        
        // then try to load, failure here will be a logged error
        try {
            deps = require(path);
        } catch (e) {
            // Console.lite(`dependency-loader: No barrel found in ${shortpath} (index.ts for ${basename})`);
        }

        return deps;
    }
}

export let DependencyLoader = new DependencyLoaderSingleton();
