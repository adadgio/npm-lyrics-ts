/**
 * A bridge with express and the route container
 * to actually set route listeners
 */
import 'reflect-metadata';
import * as express     from 'express';
import * as container   from '@lyrics/core/container';
import { RouterUtils }  from '@lyrics/routing';
import { Console, KernelEvents, KernelListener, XEvent } from '@lyrics/core';
import { RouteMetadata, ActionTypes }                    from '@lyrics/routing/metadata';
import { Request, Response, JsonResponse }               from '@lyrics/http';

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
        // @log Listen to route requests & responses
        KernelListener.on(XEvent.ROUTER_REQUEST, (args) => {
            Console.cyan(args);
        });
        KernelListener.on(XEvent.ROUTER_RESPONSE, (args) => {
            Console.magenta(args);
        });
    }

    private expressRouterAddRoute(basePath:string, metadata: RouteMetadata) {
        let app: any = container.getApp();
        let path = RouterUtils.joinPathes(basePath, metadata.getPath());

        let ctrlTarget = container.getCtrlTarget(metadata.getParentClassName()),
            ctrlInstance = new ctrlTarget(app),
            methodAction = ctrlInstance[metadata.getMethodName()];

        switch (metadata.getType()) {
            case ActionTypes.GET:
                app.router.get(path, (req, res, next) => {

                    KernelEvents.emit(XEvent.ROUTER_REQUEST, `router-bridge.ts REQ ${path} -x ${ActionTypes.GET}`);

                    let info: any;

                    let duration = RouterUtils.execTime(() => {
                        let args = this.getActionMethodReflectedArgs(req, metadata);
                        let result = methodAction.apply(ctrlInstance, args);

                        info = this.sendResponse(result, res);
                    });

                    KernelEvents.emit(XEvent.ROUTER_RESPONSE, `router-bridge.ts RSP ${path} -x ${ActionTypes.GET} ${info.restype} (in ${duration})`);
                });

            break;
            case ActionTypes.POST:
                app.router.post(path, (req, res, next) => {
                    KernelEvents.emit(XEvent.ROUTER_REQUEST, `router-bridge.ts REQ ${path} -x ${ActionTypes.POST}`);

                    let info: any;
                    let reqErrors = RouterUtils.checkRequirements(req, metadata);

                    let duration = RouterUtils.execTime(() => {
                        let args = this.getActionMethodReflectedArgs(req, metadata);
                        let result = methodAction.apply(ctrlInstance, args);

                        if (reqErrors.length === 0) {
                            info = this.sendResponse(result, res);
                        } else {
                            info = this.sendErrorResponse(result, res, reqErrors);
                        }
                    });

                    KernelEvents.emit(XEvent.ROUTER_RESPONSE, `router-bridge.ts RSP ${path} -x ${ActionTypes.POST} ${info.restype} (in ${duration})`);
                });
            break;
            default:
                // not applicable
            break;
        }

        this.addDebuggedRoute(path, metadata);
    }

    private sendResponse(result: any, res: express.Response) {
        let info = { restype: null };

        if (result instanceof Response) {
            info.restype = 'text/plain';
            res.send(result.getContent());

        } else if (result instanceof JsonResponse) {
            info.restype = 'application/json';
            res.json(result.getJsonContent());

        } else if (result instanceof String || typeof result === 'number') {
            info.restype = 'text/plain';
            res.send(result.toString());

        } else {
            throw Error('Controller response must be a string or an instance of Response or JsonResponse');
        }

        return info;
    }

    private sendErrorResponse(result: any, res: express.Response, errors: any) {
        let info = { restype: null };

        if (result instanceof Response) {
            info.restype = 'text/html';
            res.statusCode = 400;
            res.send(`invalid request parameters:\n${errors.toString()}`);

        } else if (result instanceof JsonResponse) {
            info.restype = 'application/json';
            res.statusCode = 400;
            res.json({ type: 'error', message: `invalid request parameters`, details: errors });

        } else if (result instanceof String || typeof result === 'number') {
            info.restype = 'text/plain';
            res.statusCode = 400;
            res.send(`invalid request parameters:\n${errors.toString()}`);

        } else {
            throw Error('Controller response must be a string or an instance of Response or JsonResponse');
        }

        return info;
    }

    private getActionMethodReflectedArgs(req: express.Request, metadata: RouteMetadata) {
        let args = [];

        for (let reflParam of metadata.getReflectionParams()) {
            let paramTyping = reflParam.prototype.constructor.name;
            if (paramTyping === 'Request') {
                let request = new Request(req);
                args.push(request);
            }
        }

        return args;
    }

    private addDebuggedRoute(path: string, metadata: RouteMetadata) {
        let debuggedRoute = metadata.type + ' ' + path + ' --> ' + metadata.getParentClassName() + '::' + metadata.getMethodName() + '()';
        this.debuggedRoutes.push(debuggedRoute);
    }
}

export let RouterBridge = new RouterBridgeSingleton();
