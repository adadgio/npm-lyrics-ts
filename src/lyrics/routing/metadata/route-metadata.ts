import 'reflect-metadata';
import { RouteOptions } from './';

export class RouteMetadata {
    parentClassName: string;
    target: Function;
    path: string;
    methodName: string;
    options: Object;
    type: 'GET'|'POST'|'PUT'|'DELETE';
    firewall: string;
    descriptor: PropertyDescriptor;
    reflectionParams: any;

    constructor(parentClassName: string, path: string, options: RouteOptions, target: Function, methodName: string, descriptor: PropertyDescriptor) {
        this.parentClassName = parentClassName;
        this.path = path;
        this.options = options;
        this.target = target;
        this.type = options.type;
        this.methodName = methodName;
        this.descriptor = descriptor;

        // use reflection api to determine parameter types
        let reflection = Reflect.getMetadata('design:paramtypes', target, methodName);
        this.reflectionParams = reflection;
    }

    getPath() {
        return this.path;
    }

    getReflectionParams() {
        return this.reflectionParams;
    }

    getType() {
        return this.type;
    }

    getRequirements() {
        return (typeof this.options['requirements'] === 'object') ? this.options['requirements'] : null;
    }
    
    getFirewallServiceId() {
        return (typeof this.options['firewall'] === 'string') ? this.options['firewall'] : null;
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
