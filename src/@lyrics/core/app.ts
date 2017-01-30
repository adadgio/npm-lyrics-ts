/**
 * Main app component wrapper
 * Handle env variables, express and loads routing
 */
import * as fs      from 'fs';
import * as yaml    from 'yamljs';
import * as dotenv  from 'dotenv';
import * as express from 'express';
import * as parser  from 'body-parser';

import * as container from './../routing/container';
import * as controllers from './../../app/controller';
import { RouterBridge } from './../routing';
import { Console, Argument, Configuration } from './';

export class App {
    private readonly root: string;
    private readonly env: string;

    public config: Configuration;
    public router: express.Router;

    private xdebug: boolean;
    private express: express.Application;
    private services: Object = {};
    private webroot: string = null;

    constructor()
    {
        // use argument module to retrieve and environment variable
        Argument.require('env', ['dev', 'staging', 'prod']);
        this.env = Argument.getArg('env');

        // then load the correct ./config environment file and
        // read its values with the dotenv module
        // dotenv.config({ path: __dirname + '/../app/config/conf.' + this.env });
        let confpath = __dirname + '/../../app/config/config.'+ this.env +'.yml';
        if (!fs.existsSync(confpath)) {
            throw new Error('Config file not found at '+ confpath);
        }

        let yamlConfig = yaml.load(confpath);

        // save configuration parameters into app
        // and basic default app configuration vars
        this.xdebug = false;
        this.config = new Configuration();
        this.config.inject(yamlConfig);
        container.setApp(this);
    }

    public run(): void
    {
        // prepare express and middlewares
        this.express = express();
        this.middleware();

        // declare and prepare router
        this.router = express.Router();
        this.routing();
    }

    private middleware(): void
    {
        // tell express to parse incoming body from json to object
        // this.express.use(parser.json());
        this.express.use(parser.urlencoded({ extended: false }));
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
        for (let ctrl in controllers) {
            this.log(`Controller ${ctrl} read by typescript by compiler`, 0);
            // let controller = new controllers[ctrl](this);
        }

        RouterBridge.setRoutes();
        if (this.xdebug === true) {
            RouterBridge.debug();
        }

        // tell the express app to all all the
        // defined routes from this base point
        this.express.use('/', this.router);
        this.express.listen(this.config.get('framework.express.port'));
    }
    
    /**
     * Get a service from the container.
     */
    public get(name: string): Object {
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
    public register(name: string, target: Object)
    {
        container.registerService(name, target);
    }

    /**
     * Toggle app wide debug mode or not.
     */
    public debug(value: boolean): App
    {
        this.xdebug = value;
        return this;
    }

    /**
     * Logs messages to the console
     * happens only if debug mode is on
     */
    public log(msg: string, priority: number | null = 1): void
    {
        if (this.xdebug === false) { return; }

        switch (priority) {
            case 1:
                Console.info(msg);
            break;
            case 2:
                Console.warn(msg);
            break;
            case 3:
                Console.error(msg);
            break;
            default:
                Console.log(msg);
            break;
        }
    }

    getInfo() {
        return `A lyrics application`;
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
