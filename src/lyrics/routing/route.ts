/**
 * The route annotation
 */
import * as container                   from '@lyrics/core/container';
import { RouteOptions, RouteMetadata }  from '@lyrics/routing/metadata';

export function Route(route: string, options: RouteOptions): any {

    return function (target: Function, methodName: string, descriptor: TypedPropertyDescriptor<any>) {
        // save a reference to the original method
        let originalMethod = descriptor.value;

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
