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

    private expressRouterAddRoute(basePath:string, metadata: RouteMetadata)
    {
        let app: any = container.getApp();
        let path = RouterUtils.joinPathes(basePath, metadata.getPath());

        let ctrlTarget = container.getCtrlTarget(metadata.getParentClassName()),
            ctrlInstance = new ctrlTarget(app),
            methodAction = ctrlInstance[metadata.getMethodName()];

        switch (metadata.getType()) {
            case 'GET':
                app.router.get(path, (req, res, next) => {

                    KernelEvents.emit(XEvent.ROUTER_REQUEST, `router-bridge.ts REQ ${path} -x GET`);

                    const debugAnalysis = this.analyzeRequestAndSendResponse(req, res, metadata, ctrlInstance, methodAction);

                    KernelEvents.emit(XEvent.ROUTER_RESPONSE,
                        `router-bridge.ts RSP ${path} -x GET ${debugAnalysis.debug.contentType} (in ${debugAnalysis.duration})`
                    );

                });

            break;
            case 'POST':
                app.router.post(path, (req, res, next) => {
                    KernelEvents.emit(XEvent.ROUTER_REQUEST, `router-bridge.ts REQ ${path} -x POST`);

                    const debugAnalysis = this.analyzeRequestAndSendResponse(req, res, metadata, ctrlInstance, methodAction);

                    KernelEvents.emit(
                        XEvent.ROUTER_RESPONSE,
                        `router-bridge.ts RSP ${path} -x POST ${debugAnalysis.debug.contentType} (in ${debugAnalysis.duration})`
                    );

                });
            break;
            default:
                // not applicable
            break;
        }

        this.addDebuggedRoute(path, metadata);
    }

    private analyzeRequestAndSendResponse(req, res, metadata, ctrlInstance, methodAction)
    {
        let debug: any;
        let reqErrors = RouterUtils.checkRequirements(req, metadata);
        let firewallErrors = RouterUtils.checkSecurity(req, metadata);

        let duration = RouterUtils.execTime(() => {
            let args = this.getActionMethodReflectedArgs(req, metadata);
            let result = methodAction.apply(ctrlInstance, args);

            if (firewallErrors.length > 0) {
                debug = this.sendErrorResponse(result, res, firewallErrors);
            } else if (reqErrors.length === 0) {
                debug = this.sendResponse(result, res);
            } else {
                debug = this.sendErrorResponse(result, res, reqErrors);
            }
        });

        return { debug: debug, duration: duration };
    }

    private sendResponse(respResult: any, res: express.Response)
    {
        let debug = { contentType: null };

        if (respResult instanceof Response) {
            debug.contentType = 'text/plain';
            res.statusCode = respResult.getCode();
            res.send(respResult.getContent());

        } else if (respResult instanceof JsonResponse) {
            debug.contentType = 'application/json';
            res.statusCode = respResult.getCode();
            res.json(respResult.getJsonContent());

        } else if (respResult instanceof String || typeof respResult === 'number') {
            debug.contentType = 'text/plain';
            res.statusCode = 200;
            res.send(respResult.toString());

        } else {
            throw Error('router-bridge.ts controller response must be a string or an instance of Response or JsonResponse');
        }

        return debug;
    }

    private sendErrorResponse(result: any, res: express.Response, errors: any)
    {
        let debug = { contentType: null };

        if (result instanceof Response) {
            debug.contentType = 'text/html';
            res.statusCode = 400;
            res.send(`${errors.toString()}`);

        } else if (result instanceof JsonResponse) {
            debug.contentType = 'application/json';
            res.statusCode = 400;
            res.json({ type: 'error', message: `${errors[0]}`, details: errors });

        } else if (result instanceof String || typeof result === 'number') {
            debug.contentType = 'text/plain';
            res.statusCode = 400;
            res.send(`\n${errors.toString()}`);

        } else {
            throw Error('Controller response must be a string or an instance of Response or JsonResponse');
        }

        return debug;
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
