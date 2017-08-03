/**
 * Routes and controller meta data container
 * The container builds itself when ts reads
 * controllers class and method decorators
 * like @Route(...) and @Controller()
 * Inspired by https://github.com/pleerock/routing-controllers
 */
import { Console }                              from '@lyrics/core';
import { KernelEvents, KernelListener, XEvent } from '@lyrics/core';
import { EventDispatcher }                      from '@lyrics/event';
import { ControllerMeta }                       from '@lyrics/annotation';
import { RouteMetadata }                        from '@lyrics/routing/metadata';

/**
 * This variable contains global annotations
 * read from controllers classes and methods
 */
let app: any;

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

    });
    KernelListener.on(XEvent.CONTAINER_SERVICE_REQUESTED, (args) => {

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
    return (typeof _$_container.services[name] !== 'undefined' && _$_container.services[name].instance !== null);
}
export function isServiceRegistered(name) {
    return (typeof _$_container.services[name] === 'object');
}
export function registerService(name: string, target?: Object) {
    Console.comment(`container.ts Registered service [${name}]`);

    if (isServiceRegistered(name)) {
        Console.error(`container.ts Cannot register the same service twice [${name}]`);
        return;
    }

    let className = (undefined === target) ? null : target['name'];
     _$_container.services[name] = { target: target, inited: false, instance: null, className: className };
}

export function addServiceInjection(target: any, injectionKey: string, propertyKey: string)
{
    const serviceClassName = target.constructor.name;

    if (typeof _$_container.injections[serviceClassName] === 'undefined') {
        _$_container.injections[serviceClassName] = [];
    }

    _$_container.injections[serviceClassName].push({ target: target, injectionKey: injectionKey, property: propertyKey });
}

export function initService(name: string): void {
    KernelEvents.emit(XEvent.CONTAINER_SERVICE_REQUESTED, { info: `container.ts Service ${name} inited` });
    KernelEvents.emit(`${XEvent.CONTAINER_SERVICE_REQUESTED}:${name}`, { info: `container.ts Service ${name} inited` });

    const serviceClassName = _$_container.services[name].className;
    const serviceInstance = new _$_container.services[name].target();
    _$_container.services[name].instance = serviceInstance;
    Console.info(`container.ts ${name} service inited`);

    // look for injections !
    if (typeof _$_container.injections[serviceClassName] !== 'undefined') {
        for (let dependency of _$_container.injections[serviceClassName]) {
            const depServiceId =  dependency.injectionKey;
            const property = dependency.property;

            if (!isServiceInited(depServiceId)) {
                initService(depServiceId);
            }

            _$_container.services[name].instance[property] = getServiceInstance(depServiceId);
        }
    }

    // run after init callback method if it exists (on 1st init only)
    if (typeof(_$_container.services[name].instance['onInit']) === 'function') {
        _$_container.services[name].instance['onInit']();
        Console.info(`container.ts ${name} service inited using onInit()`);
    } else {
        Console.warn(`container.ts ${name}::onInit() method seems to be missing`);
    }
}

export function getRegisteredServices() {
    return _$_container.services;
}

export function getServiceInstance(name: string) {
    if (!isServiceRegistered(name)) {
        Console.warn(`container.ts Trying to instantiate a service before is was registered for "${name}"`);
        return null;
    }
    if (!isServiceInited(name)) {
         initService(name);
     }

     KernelEvents.emit(XEvent.CONTAINER_SERVICE_REQUESTED, { service: name, info: `container.ts: Service ${name} requested` });
     KernelEvents.emit(`${XEvent.CONTAINER_SERVICE_REQUESTED}:${name}`, { info: `container.ts: Service ${name} requested` });
     return _$_container.services[name].instance;
}

export function getServiceIdByClassName(className: string) {
    for (let serviceId in _$_container.services) {
        let serviceDefinition = _$_container.services[serviceId];
        if (serviceDefinition.target.name === className) {
            return serviceId;
        }
    }
    return null;
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
export function registerController(target: Object) {
    const ctrlMetadata = Reflect.getMetadata('controllerMetadata', target);
    // for controllers, we don't register the but pass the metadata
    // to the container. It will be the router bridge to read them and create routes
    this.addControllerMeta(ctrlMetadata);
}
export function addControllerMeta(metadata: ControllerMeta) {
    let className = metadata.getClassName();
    _$_container.controllers[className] = metadata;
}
export function getContollerMeta(key: any) {
    return _$_container.controllers[key];
}

/**
 * Event dispatcher startup(s)
 */
export function startEventDispatcherListeners() {
    // event dispatcher logs are magenta
    Console.magenta(`container.ts event dispatcher listeners attached`);
    EventDispatcher.startListening();
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
