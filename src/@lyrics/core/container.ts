/**
 * Routes and controller meta data container
 * The container builds itself when ts reads
 * controllers class and method decorators
 * like @Route(...) and @Controller()
 * Inspired by https://github.com/pleerock/routing-controllers
 */
import { Console } from './../core';
import { RouteMetadata, ControllerMetadata } from './../routing/metadata';

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
export function addServiceInjection(name: string, injectionKey: string) {
    if (typeof _$_container.injections[name] === 'undefined') {
        _$_container.injections[name] = [];
    }

    _$_container.injections[name].push(injectionKey);
}
export function initService(name: string) {
    _$_container.app.log(`container.ts: Service ${name} inited`, 0);
    
    let args = [],
        serviceInstance = null,
        selfKlassName =  _$_container.services[name].className;

    if (typeof _$_container.injections[selfKlassName] !== 'undefined') {
        for (let paramName of _$_container.injections[selfKlassName]) {

            if (isAliased(paramName)) {
                // the param is aliased with "@", its a service we need to inject

                if (unalias(paramName) === name) {
                    Console.exception(`container.ts Cirular reference detected, tried to inject ${paramName} into ${name}`);
                }

                let serviceInstance = getServiceInstance(unalias(paramName));
                // let serviceInstance = _$_container.app.get(unalias(paramName));
                serviceInstance.sayBye();
                args.push(serviceInstance);
                console.log(serviceInstance.sayBye());
                // args.push(serviceInstance);
                // let serviceInstance = new _$_container.services[paramName].target();

            } else {
                // else its not a service but a param to inject
            }
        }
    }

    _$_container.services[name].instance = new _$_container.services[name].target('sdg');
}
export function getServiceInstance(name: string) {
     if (!isServiceInited(name)) {
         initService(name);
     }

     _$_container.app.log(`container.ts: Service ${name} requested`, 0);
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
    return string.replace(/^%*%$/, '');
}
