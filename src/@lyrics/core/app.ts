/**
 * Main app component wrapper
 * Handle env variables, express and loads routing
 */
import * as fs      from 'fs';
import * as yaml    from 'yamljs';
import * as dotenv  from 'dotenv';
import * as express from 'express';
import * as parser  from 'body-parser';

import * as controllers  from './../../app/controller';
import { Argument, Configuration } from './';

export class App {
    private readonly root: string;
    private readonly env: string;

    public router: express.Router;
    public express: express.Application;

    private config: Configuration;
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
        this.config = new Configuration();
        this.config.inject(yamlConfig);
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
        // tell express to parse incoming body
        // from json to object
        this.express.use(parser.json());
        this.express.use(parser.urlencoded({ extended: false }));

        if (this.webroot !== null) {
            this.express.use('/web', express.static(this.webroot));
        }
    }

    private routing(): void
    {
        for (let ctrl in controllers) {
            let controller = new controllers[ctrl](this, this.router);
            controller.setRoutes();
        }

        // tell the express app to all all the
        // defined routes from this base point
        this.express.use('/', this.router);
        this.express.listen(this.config.get('framework.express.port'));
    }

    public setWebRoot(path: string)
    {
        this.webroot = path;
    }

    public get(name: string) {
        // init service with dependency injections in case its not
        if (typeof this.services[name] === 'undefined') {
            // service was not registered
            throw new Error('Service "['+ name +']" was never registered');

        } else if (this.services[name].inited === false) {
            // service registered but never inited (contructed + inject)
            this.services[name].inited = true;
            this.services[name].service = new this.services[name].target({ router: this.router, config: this.config });
        }

        return this.services[name].service;
    }

    public register(name: string, target: any) {
        this.services[name] = { inited: false, target: target, service: null };
    }

    public getEnv()
    {
        return this.env;
    }

    public getConfig()
    {
        return this.config;
    }

    public getConfigValue(name: string)
    {
        return this.config.get(name);
    }
}
