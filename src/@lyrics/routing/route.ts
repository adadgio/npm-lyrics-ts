/**
 * The route annotation
 */
import 'reflect-metadata';
import * as container from './container';
import { RouteOptions, RouteMetadata } from './metadata';

export function Route(route: string, options: RouteOptions): any {

    return function (target: Function, methodName: string, descriptor: TypedPropertyDescriptor<any>) {
        // save a reference to the original method
        let originalMethod = descriptor.value;

        // use reflection api to determine parameter types
        let type = Reflect.getMetadata('design:type', target, methodName);
        let paramsMeta = Reflect.getMetadata('design:paramtypes', target, methodName);
        
        // descriptor.value = function (...args: any[]) {
        //     let result = originalMethod.apply(target, args);
        //     return result;
        // };

        // string name of the parent class the method belongs to
        let parentClassName = target.constructor.prototype.constructor.name;
        const metadata = new RouteMetadata(parentClassName, route, options, target, methodName, descriptor);

        container.addRouteMeta(metadata);

        // optional, code work without this
        // return descriptor;
    }
}
