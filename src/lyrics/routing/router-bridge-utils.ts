/**
 * A bridge with express and the route container
 * to actually set route listeners
 */
import 'reflect-metadata';
import * as express                         from 'express';
import * as container                       from '@lyrics/core/container';
import { App, Console }                     from '@lyrics/core';
import { RouteMetadata, ActionTypes }       from '@lyrics/routing/metadata';
import { Request, Response, JsonResponse }  from '@lyrics/http';

class RouterBridgeUtilsSingleton {
    constructor() {

    }

    /**
     * Wrap any syncroneous function
     * inside something that calculates
     * its execution time
     */
    public execTime(task: Function) {
        let hrstart = process.hrtime();
        task();
        let hrend = process.hrtime(hrstart);
        return `${hrend[0]}s ${hrend[1]/1000000}ms`;
    }

    public joinPathes(basePath: string, path: string) {
        return '/' + this.removeTrailingSlashes(basePath) + '/' + this.removeTrailingSlashes(path);
    }

    public removeTrailingSlashes(string: string) {
        return string.replace(/^\/|\/$/g, '');
    }

    public checkRequirements(req: express.Request, metadata: RouteMetadata): Array<string>
    {
        const BODY = 'body';
        const HEADERS = 'headers';

        let errors = [],
            requirements = metadata.getRequirements();

        // if no requirements
        if (requirements == null) {
            return errors;
        }

        if (typeof requirements[BODY] === 'object') {
            for (let prop in requirements[BODY]) {
                let constraints = requirements[BODY][prop];

                if (this.isUndefined(prop, req.body)) {
                    errors.push(`request body parameter [${prop}] is required, 'undefined' given`);
                }

                if (!this.isUndefined(prop, req.body)
                    && this.constraintIsInvalid(prop, req.body, constraints)
                ) {
                    let strConst = (typeof(constraints) === 'string') ? constraints : constraints.join('|');
                    errors.push(`request body parameter [${prop}] must be ${strConst}, '${this.typeOfFixed(prop, req.body)}' given`);
                }

            }
        }

        if (typeof requirements[HEADERS] === 'object') {
            for (let key in requirements[HEADERS]) {
                let required = requirements[HEADERS][key];
            }
        }

        return errors;
    }

    public checkSecurity(req: express.Request, metadata: RouteMetadata): Array<string>
    {
        let errors = [],
            firewallServiceId = metadata.getFirewallServiceId();

        // if metadata did not specify a security service id, skip security
        if (null === firewallServiceId) {
            return [];
        }

        const firewallService: any = container.getServiceInstance('security.service');
        const securityCheckResult = firewallService.checkCrendentials(req);

        if (securityCheckResult === true || typeof securityCheckResult === 'undefined') {
            return [];
        } else {
            const errors = securityCheckResult;

            // let errors always be an array
            if (errors instanceof Array) {
                return errors;
            } else if (typeof errors === 'string') {
                return [errors];
            } else if (errors === false) {
                return ['router-bridge-utils.ts unauthorized'];
            } else {
                throw Error(`router-bridge-utils.ts checkSecurity() error return type must be false|string|array`);
            }
        }
    }

    public isJsonRequest(req: express.Request) {
        return (/application\/json/.test(req.get('Content-Type'))) ? true : false;
    }

    private isUndefined(prop: string, body: any) {
        return (typeof body[prop] === 'undefined') ? true : false;
    }

    private constraintIsInvalid(prop: string, body: any, constraints: string|Array<string>) {
        let paramType = this.typeOfFixed(prop, body);

        if (typeof(constraints) === 'string') {
            return (paramType !== constraints) ? true : false;
        } else {
            return (constraints.indexOf(paramType) === -1) ? true : false;
        }
    }

    private typeOfFixed(prop: string, body: any) {
        if (typeof(body[prop]) === 'undefined') {
            return 'undefined';
        } else if (body[prop] === null) {
            return 'null';
        } else {
            return typeof(body[prop])
        }
    }
}

export let RouterUtils = new RouterBridgeUtilsSingleton();
