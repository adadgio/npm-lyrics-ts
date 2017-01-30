/**
 * A bridge with express and the route container
 * to actually set route listeners
 */
import * as express from 'express';
import * as container from './../core/container';
import { App, Console } from './../core';
import { RouteMetadata, ActionTypes } from './metadata';

class RouterBridgeSingleton {
    private debuggedRoutes: Array<string>;

    constructor() {
        this.debuggedRoutes = [];
    }

    setRoutes() {
        // first find controllers annotations (to find base pathes)
        for (let className in container.getControllersAnnotations()) {

            let basePath = container.getContollerMeta(className).getBaseRoute();

            // the loop through all the routes in controller methods
            for (let metadata of container.getMethodAnnotations(className)) {
                this.expressRouterAddRoute(basePath, metadata);
            }
        }
    }

    debug() {
        Console.info('ROUTER DEBUG');

        for (let routeDebugPath of this.debuggedRoutes) {
            Console.info(routeDebugPath);
        }
    }

    private expressRouterAddRoute(basePath:string, metadata: RouteMetadata) {
        let app: any = container.getApp();
        let path = this.joinPathes(basePath, metadata.path);
        
        let ctrlTarget = container.getCtrlTarget(metadata.getParentClassName()),
            ctrlInstance = new ctrlTarget(app),
            methodAction = ctrlInstance[metadata.methodName];

        switch (metadata.getType()) {
            case ActionTypes.GET:

                let args = [];
                app.router.get(path, (req, res, next) => {
                    app.log(`router-bridge.ts Route called -x ${ActionTypes.GET} ${path}`, 0);
                    let result = methodAction.apply(ctrlInstance, args);
                    // methodAction(args);
                    // res.json({ message: `It works!` });
                    res.json({ message: `It works!` });
                });

            break;

            case ActionTypes.POST:
                app.router.post(path, (req, res, next) => {
                    res.json({ message: `It works!` });
                });
            break;

            default:
                // not applicable
            break;
        }

        this.addDebuggedRoute(path, metadata);
    }

    private joinPathes(basePath: string, path: string) {
        return '/' + this.removeTrailingSlashes(basePath) + '/' + this.removeTrailingSlashes(path);
    }

    private removeTrailingSlashes(string: string) {
        return string.replace(/^\/|\/$/g, '');
    }

    private addDebuggedRoute(path: string, metadata: RouteMetadata) {
        let debuggedRoute = metadata.type + ' ' + path + ' --> ' + metadata.getParentClassName() + '::' + metadata.getMethodName() + '()';
        this.debuggedRoutes.push(debuggedRoute);
    }
}

export let RouterBridge = new RouterBridgeSingleton();
