/**
 * Routes and controller meta data container
 * The container builds itself when ts reads
 * controllers class and method decorators
 * like @Route(...) and @Controller()
 * Inspired by https://github.com/pleerock/routing-controllers
 */
import { Console, KernelEvents, KernelListener, XEvent } from '@lyrics/core';
import { RouteMetadata, ControllerMetadata } from '@lyrics/routing/metadata';

/**
 * This variable contains global annotations
 * read from controllers classes and methods
 */
let app: any, injections: Object;
const _$_container = {
    app: app,
    services: {},
    methods: {},
    controllers: {},
    injections: {},
};

export function debug() {
    // @log Service calls and ignition
    KernelListener.on(XEvent.CONTAINER_SERVICE_INITED, (args) => {
        Console.lite(args);
    });
    KernelListener.on(XEvent.CONTAINER_SERVICE_REQUESTED, (args) => {
        Console.lite(args);
    });
}

export function getMethodsAnnotations() {
    return _$_container.methods;
}
export function getAnnotations() {
    return _$_container;
}
export function getControllersAnnotations() {
    return _$_container.controllers;
}
export function getMethodAnnotations(className) {
    return _$_container.methods[className];
}
export function getCtrlTarget(className) {
    return _$_container.controllers[className].getTarget();
}

export function setApp(app) {
    _$_container.app = app;
}
export function getApp() {
    return _$_container.app;
}
/**
 * Service functions
 */
export function isServiceInited(name) {
    return (_$_container.services[name].instance !== null);
}
export function isServiceRegistered(name) {
    return (typeof _$_container.services[name] === 'object');
}
export function registerService(name: string, target?: Object) {
    let className = (undefined === target) ? null : target['name'];
     _$_container.services[name] = { target: target, inited: false, instance: null, className: className };
}
export function addServiceInjection(name: string, injectionKey: string, propertyName: string) {
    if (typeof _$_container.injections[name] === 'undefined') {
        _$_container.injections[name] = [];
    }

    _$_container.injections[name].push({ key: injectionKey, property: propertyName });
}
export function initService(name: string) {
    KernelEvents.emit('container:service:inited', `container.ts: Service ${name} inited`);

    let serviceInstance = new _$_container.services[name].target();
    _$_container.services[name].instance = serviceInstance;

    let diArgs = {},
        selfKlass = _$_container.services[name].className;

    if (typeof _$_container.injections[selfKlass] !== 'undefined') {

        for (let dependecy of _$_container.injections[selfKlass]) {

            if (isAliased(dependecy.key)) {
                // the param is aliased with "@", its a service we need to inject

                if (unalias(dependecy.key) === name) {
                    Console.exception(`container.ts Cirular reference detected, tried to inject ${dependecy.key} into ${name}`);
                }

                let diInstance = getServiceInstance(unalias(dependecy.key));
                diArgs[dependecy.property] = diInstance;

            } else if (isPercent(dependecy.key)) {
                // else its not a service but a parameter from config to inject
                let paramName = unpercent(dependecy.key);
                let paramValue = _$_container.app.config.get(paramName);
                diArgs[dependecy.property] = paramValue;

            } else {
                // its nothing
                Console.exception(`container.ts Unable to inject ${dependecy.key} into ${name}, reference must be a @service of %config.accessor%`);
            }
        }
    }
    
    if (typeof _$_container.services[name].instance['injector'] === 'function') {
        _$_container.services[name].instance['injector'].apply(serviceInstance, [diArgs]);
    }

    // run after init callback method if it exists (on 1st init only)
    if (typeof(_$_container.services[name].instance['onInit']) === 'function') {
        _$_container.services[name].instance['onInit']();
    }
}
export function getServiceInstance(name: string) {
     if (!isServiceInited(name)) {
         initService(name);
     }

     KernelEvents.emit('container:service:requested', `container.ts: Service ${name} requested`);
     return _$_container.services[name].instance;
}

export function getServiceIdByClassName(className: string) {
    for (let serviceId in _$_container.services) {
        let serviceDefinition = _$_container.services[serviceId];
        if (serviceDefinition.target.name === className) {
            return serviceId;
        }
    }
    return false;
}

export function getServiceDefinitionByClassName(className: string) {
    for (let serviceId in _$_container.services) {
        let serviceDefinition = _$_container.services[serviceId];
        if (serviceDefinition.target.name === className) {
            return serviceDefinition;
        }
    }
    return false;
}

/**
 * Add route annotation metadata to container
 * Method annotations go in method routes
 */
export function addRouteMeta(metadata: RouteMetadata) {
    let className = metadata.getParentClassName();

    if (typeof _$_container.methods[className] === 'undefined') {
        _$_container.methods[className] = [];
    }

    _$_container.methods[className].push(metadata);
}

/**
 * Add controllers base annotation metadata to container
 * Controllers annotations go in controller base routes
 */
export function addControllerMeta(metadata: ControllerMetadata) {
    let className = metadata.getClassName();
    _$_container.controllers[className] = metadata;
}
export function getContollerMeta(key: any) {
    return _$_container.controllers[key];
}

function unalias(string: string) {
    return string.replace(/^@/, '');
}
function isAliased(string: string) {
    return string.indexOf('@') === -1 ? false : true;
}
function isPercent(string: string) {
    return string.indexOf('%') === -1 ? false : true;
}
function unpercent(string: string) {
    return string.replace(/%/g, '');
}
