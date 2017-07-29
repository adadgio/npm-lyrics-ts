/**
 * Ts loader component, requires barrels for
 * controllers, services and models in each bundle
 * and let typescript analyse it
 */
import * as fs          from 'fs-extra';
import * as pathes      from 'path';
import { Console }      from '@lyrics/core';
import { PathFinder }   from '@lyrics/core';
const klawSync = require('klaw-sync');

class DependencyLoaderModule {

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
        const srcDir = PathFinder.getRootDir();

        let controllers = {};
        let services = {};

        // Console.info(`dependency-loader.ts adding default /_debug controller...`);
        // controllers['DebugController'] = pathes.normalize(`${srcDir}/lyrics/controller`);

        Console.info(`dependency-loader.ts reading bundles...`);

        // the job here is basically to  read all the files in
        // the bundle recursively and look for annotations
        const bundleDir = pathes.normalize(`${srcDir}/app/bundles/${bundle}`);

        const files = klawSync(bundleDir, { nodir: true });
        
        for (let file of files) {
            const ext = pathes.extname(file.path);

            if (['.ts', '.tsx', '.js'].indexOf(ext) === -1) { continue; }
            if (pathes.basename(file.path) === 'index.ts') { continue; }
            // we just need to do that so that typescript reads the file
            // instances will be created and passed to container and
            // deleted here afterwards

            // retrieve the { AcmeController: [Function: AcmeController] }
            const importedObject = require(file.path); // require does obj with key: class name -> function actual class
            const nameOfClass = Object.keys(importedObject)[0];
            const finalClass = importedObject[nameOfClass];

            // get target meta data
            const serviceMetadata = Reflect.getMetadata('serviceMetadata', finalClass);
            const controllerMetadata = Reflect.getMetadata('controllerMetadata', finalClass);

            if (serviceMetadata) {

                const serviceName = serviceMetadata.getName();
                services[serviceName] = finalClass;

            } else if (controllerMetadata) {

                controllers[nameOfClass] = finalClass;

            } else {
                // yeah ?
            }
        }

        // load all controllers from AcmeBundle/controller/index.ts
        // there is nothing to do afterwards, typescript will read
        // controllers annotations and router bridge then know that
        // it will need to create instances at build time
        // let controllers = this.require(ctrlsPath);

        // // register all services in the container
        // // from AcmeBundle/service/index.ts
        // let services = this.require(srvcsPath);

        return {
            controllers: controllers,
            services: services,
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

        // check if directory exists (../controler, models, service, blahblah)
        // if the folder iteself does not exist there absolutely
        // no need to look for an index ts file or trying to require or show a warning
        let srcdir = `${PathFinder.getRootDir()}`;
        let fullpath = `${srcdir}/${shortpath}`;
        let dirExists = fs.existsSync(fullpath);

        if (!dirExists) {
            return deps;
        }

        try {
            deps = require(path);
        } catch (e) {
            // No barrel found in ${shortpath} (index.ts for ${basename})
            Console.lite(`dependency-loader: Failed to require ${shortpath}, no barrel found or evaluating script failed`);
            Console.error(e);
        }

        return deps;
    }
}

export let DependencyLoader = new DependencyLoaderModule();
