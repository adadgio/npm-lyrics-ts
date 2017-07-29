/**
 * Main app component wrapper
 * Handle env variables, express and loads routing
 */
import * as fs          from 'fs';
import * as http        from 'http';
import * as yaml        from 'yamljs';
import * as express     from 'express';
import * as parser      from 'body-parser';
import * as child       from 'child_process';
import * as container                       from '@lyrics/core/container';
import { RouterBridge, RouterUtils }        from '@lyrics/routing';
import { Console, Argument, Configuration } from '@lyrics/core';
import { PathFinder, DependencyLoader }     from '@lyrics/core';

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
    // private services: Object = {};
    private preloadedServices: Array<string> = [];
    private controllers: any;

    constructor()
    {
        // use argument module to retrieve and environment variable
        Argument.require('env', ['dev', 'staging', 'prod']);
        this.env = Argument.getArg('env');
        
        // 2nd param is winston loggin level error|warn|info|verbose|debug|silly
        Console.setEnv(this.env, 'debug');

        // then load the correct config environment file
        let confpath = __dirname + '/../../app/config/config.'+ this.env +'.yml';
        if (!fs.existsSync(confpath)) {
            throw new Error('Config file not found at '+ confpath);
        }

        let yamlConfig = yaml.load(confpath);

        // save configuration parameters into app
        // and basic default app configuration vars
        this.root = PathFinder.getRootDir(); // path to the src dir
        this.xdebug = false;
        this.config = new Configuration();
        this.config.inject(yamlConfig);
        container.setApp(this);
    }

    public run(): void
    {
        this.onDebugAll();

        // preload services if applicable note that services are never inited twice if
        // properly done, that is using the container method (container::initService())
        for (let serviceId in container.getRegisteredServices()) {
            if (this.preloadedServices.indexOf(serviceId) > -1 && !container.isServiceInited(serviceId)) {
                container.initService(serviceId);
            }

            // launch services defined as sub processes (@Process decorator)
            let serviceInstance = container.getServiceInstance(serviceId);
        }

        // prepare express and middlewares
        this.express = express();
        this.server = http.createServer(this.express);
        this.middleware();

        // declare and prepare router
        this.router = express.Router();
        this.routing();

        // open ports and listen
        this.server.listen(this.config.get('framework.express.port'));

        // also bind  event dispatcher listeners (actually just delegate)
        // to the container who will just call dispatcher "start Listening method"
        container.startEventDispatcherListeners();
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
        const deps = DependencyLoader.readBundles(bundle);

        // register all services in the container
        for (let serviceName in deps.services) {
            let service = deps.services[serviceName];
            container.registerService(serviceName, service);
        }

        // for controllers, we don't register the but pass the metadata
        // to the container. It will be the router bridge to read them and create routes
        for (let className in deps.controllers) {
            let controller = deps.controllers[className];
            container.registerController(controller);
        }

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

    public preloadServices(names: Array<string>)
    {
        this.preloadedServices = names;
        return this;
    }
}
