/**
 * Routes and controller meta data container
 * The container builds itself when ts reads
 * controllers class and method decorators
 * like @Route(...) and @Controller()
 * Inspired by https://github.com/pleerock/routing-controllers
 */
import { RouteMetadata, ControllerMetadata } from './metadata';

/**
 * This variable contains global annotations
 * read from controllers classes and methods
 */
const _$_container = {
    app: {},
    services: {},
    methods: {},
    controllers: {},
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
export function registerService(name: string, target: Object) {
     _$_container.services[name] = { target: target, inited: false, instance: null };
}
export function initService(name: string) {
    _$_container.services[name].instance = new _$_container.services[name].target();
}
export function getServiceInstance(name: string) {
     if (!isServiceInited(name)) {
         initService(name);
     }

     return _$_container.services[name].instance;
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
