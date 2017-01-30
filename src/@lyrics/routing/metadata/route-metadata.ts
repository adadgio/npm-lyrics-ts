
import { RouteOptions } from './';

export class RouteMetadata {
    parentClassName: string;
    target: Function;
    path: string;
    methodName: string;
    options: Object;
    type: 'GET'|'POST'|'PUT'|'DELETE';
    descriptor: PropertyDescriptor;

    constructor(parentClassName: string, path: string, options: RouteOptions, target: Function, methodName: string, descriptor: PropertyDescriptor) {
        this.parentClassName = parentClassName;
        this.path = path;
        this.options = options;
        this.target = target;
        this.type = options.type;
        this.methodName = methodName;
        this.descriptor = descriptor;
    }

    getType() {
        return this.type;
    }

    getParentClassName() {
        return this.parentClassName;
    }

    getOptions() {
        return this.options;
    }

    getMethodName() {
        return this.methodName;
    }

    getOption(key: string) {
        return this.options[key];
    }

    getMethod() {
        return this.descriptor.value;
    }
}
