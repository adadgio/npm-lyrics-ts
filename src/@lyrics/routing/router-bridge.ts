/**
 * A bridge with express and the route container
 * to actually set route listeners
 */
import 'reflect-metadata';
import * as express             from 'express';
import * as container           from './../core/container';
import { App, Console }         from './../core';
import { RouteMetadata, ActionTypes }       from './metadata';
import { Request, Response, JsonResponse }  from './../http';

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
        let app: any = container.getApp();
        for (let routeDebugPath of this.debuggedRoutes) {
            app.log(`router-bridge.ts ${routeDebugPath}`, 'info');
        }
    }

    private expressRouterAddRoute(basePath:string, metadata: RouteMetadata) {
        let app: any = container.getApp();
        let path = this.joinPathes(basePath, metadata.getPath());

        let ctrlTarget = container.getCtrlTarget(metadata.getParentClassName()),
            ctrlInstance = new ctrlTarget(app),
            methodAction = ctrlInstance[metadata.getMethodName()];


        switch (metadata.getType()) {
            case ActionTypes.GET:
                // let args = this.argsFromReflectionParams(metadata);
                // console.log(args);

                app.router.get(path, (req, res, next) => {
                    let args = [];
                    app.log(`router-bridge.ts REQ ${path} -x ${ActionTypes.GET}`, 'info');

                    for (let reflParam of metadata.getReflectionParams()) {
                        let paramTyping = reflParam.prototype.constructor.name;

                        if (paramTyping === 'Request') {
                            let request = new Request(req);
                            args.push(request);
                        }
                    }

                    let result = methodAction.apply(ctrlInstance, args);

                    if (result instanceof Response) {
                        app.log(`router-bridge.ts RSP ${path} -x ${ActionTypes.GET} text/plain`, 'info');
                        res.send(result.getContent());

                    } else if (result instanceof JsonResponse) {
                        app.log(`router-bridge.ts RSP ${path} -x ${ActionTypes.GET} application/json`, 'info');
                        res.json(result.getJsonContent());

                    } else if (result instanceof String || typeof result === 'number') {
                        app.log(`router-bridge.ts RSP ${path} -x ${ActionTypes.GET} text/plain`, 'info');
                        res.send(result.toString());

                    } else {
                        app.log('Controller response must be a string or an instance of Response or JsonResponse', 'error');
                    }
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
