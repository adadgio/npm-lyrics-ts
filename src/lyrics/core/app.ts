/**
 * Main app component wrapper
 * Handle env variables, express and loads routing
 */
import * as fs       from 'fs';
import * as http     from 'http';
import * as yaml     from 'yamljs';
import * as express  from 'express';
import * as parser   from 'body-parser';

import * as container from './../core/container';
import { RouterBridge, RouterUtils } from './../routing';
import { Console, Argument, Configuration, KernelListener } from './';

interface ExpressError {
    status?: number;
    message?: string;
}

export class App {
    private readonly root: string;
    private readonly env: string;

    public config: Configuration;
    public router: express.Router;
    public server: any; // http server returned by express.listen (or created yourself)
    public xdebug: boolean;

    private webroot: string;
    private express: express.Application;
    private services: Object = {};
    private controllers: any;

    constructor()
    {
        // use argument module to retrieve and environment variable
        Argument.require('env', ['dev', 'staging', 'prod']);
        this.env = Argument.getArg('env');
        Console.setEnv(this.env, true); // for cleaner debug logs

        // then load the correct config environment file
        let confpath = __dirname + '/../../app/config/config.'+ this.env +'.yml';
        if (!fs.existsSync(confpath)) {
            throw new Error('Config file not found at '+ confpath);
        }

        let yamlConfig = yaml.load(confpath);

        // save configuration parameters into app
        // and basic default app configuration vars
        this.root = process.env.PWD + '/src';
        this.xdebug = false;
        this.config = new Configuration();
        this.config.inject(yamlConfig);
        container.setApp(this);
    }
    
    public run(): void
    {
        this.onDebugAll();

        // prepare express and middlewares
        this.express = express();
        this.server = http.createServer(this.express);
        this.middleware();

        // declare and prepare router
        this.router = express.Router();
        this.routing();

        // open ports and listen
        this.server.listen(this.config.get('framework.express.port'));
    }

    private middleware(): void
    {
        // tell express to parse incoming body from json to object
        this.express.use(parser.json());
        this.express.use(parser.urlencoded({ extended: false }));

        // serving static files
        if (this.webroot) {
            this.express.use('/public', express.static(this.webroot));
        }
    }

    /**
     * Creates routing from controllers explicitely
     * decorated with @Controller or @Route annotations.
     */
    private routing()
    {
        // just read the controller (for typescript compiler)
        // there is nothing to do... the annotations are
        // automatically read here by ts (??). Strange but it works
        // router bridge is the one responsible for creating the ctrl instances
        // for (let ctrl in this.controllers) {
        //     // let controller = new controllers[ctrl](this);
        // }

        RouterBridge.setRoutes();

        // tell the express app to all all the
        // defined routes from this base point
        this.express.use('/', this.router);

        // catch express errors (like body parse errors, etc) to be able to
        // return correct error response when application/json is detected
        // this.express.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        //     if (err instanceof SyntaxError) {
        //         let errorMsg = (this.xdebug === false) ? 'Internal express SyntaxError' : err; // debug or not, show full error ?
        //
        //         if (RouterUtils.isJsonRequest(req)) {
        //             res.statusCode = 500;
        //             res.json({ type: 'error', error: err.toString() });
        //         } else {
        //             res.statusCode = 500;
        //             res.send(errorMsg);
        //         }
        //     } else {
        //         next();
        //     }
        // });
    }

    /**
     * Get a service from the container.
     */
    public get(name: string) {
        // init service with dependency injections in case its not
        if (!container.isServiceRegistered(name)) {
            // service was not registered
            throw new Error(`Service [${name}] was never registered`);

        } else if (!container.isServiceInited(name)) {
            // service registered but never inited (contructed + inject)
            container.initService(name);
        }

        return container.getServiceInstance(name);
    }

    /**
     * Set service name and prototype into the container
     */
    public import(bundle: string): App
    {
        let srvcsPath = `./../../app/bundles/${bundle}/service`;
        let ctrlsPath = `./../../app/bundles/${bundle}/controller`;

        // load all controllers from AcmeBundle/controller/index.ts
        // there is nothing to do afterwards, typescript will read
        // controllers annotations and router bridge then know that
        // it will need to create instances at build time
        let controllers = require(ctrlsPath);

        // register all services in the container
        // from AcmeBundle/service/index.ts
        let services = require(srvcsPath);
        for (let className in services) {
            let service = services[className];
            let serviceId = this.createServiceName(className);
            this.register(serviceId, service);
        }

        return this;
    }

    /**
     * Set service name and prototype into the container
     */
    public register(name: string, target: Object): App
    {
        container.registerService(name, target);
        return this;
    }

    /**
     * Create service name from AcmeService to acme.service
     */
    private createServiceName(className: string): string
    {
        let parts = className.match(/[A-Z][a-z]+/g).map(s => { return s.toLowerCase(); });
        return parts.join('.');
    }

    /**
     * Set express publicly served files webroot.
     */
    public setWebroot(webroot: string): App
    {
        this.webroot = webroot;
        return this;
    }

    /**
     * Toggle app wide debug mode or not.
     */
    public debug(value: boolean): App
    {
        this.xdebug = value;

        return this;
    }

    private onDebugAll() {
        if (this.xdebug === true) {
            container.debug();
            RouterBridge.debug();
        }
    }

    public getInfo() {
        return `A lyrics application`;
    }

    /**
     * Get app environment.
     * Environment
     */
    public getRootDir()
    {
        return this.root;
    }

    /**
     * Get app environment.
     * Environment
     */
    public getEnv()
    {
        return this.env;
    }

    /**
     * Get app Configuration provider.
     */
    public getConfig()
    {
        return this.config;
    }

    public getRouter()
    {
        return this.router;
    }

    public getConfigValue(name: string)
    {
        return this.config.get(name);
    }
}
