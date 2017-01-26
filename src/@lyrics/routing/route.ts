/**
 *
 */
import * as container from './container';

export function Route(route: string): any {
    return function (target: Object, methodName: string, descriptor: PropertyDescriptor) {

        let metadata = {
            route: route,
            method: methodName,
            target: target,
        }

        container.addMethodRouteMetaData(metadata);

        return descriptor;

        // // save a reference to the original method
        // let originalMethod = descriptor.value;
        //
        // descriptor.value = function (...args: any[]) {
        //     console.log(args);
        //
        //
        //     // invoke method and get its return value
        //     let result = originalMethod.apply(this, args);
        //     return result;
        // };

        // let router = descriptor.value();
        // console.log(router);
        // router.get('/', (req, res, next) => {
        //
        // });

        // console.log(descriptor.value().app);

        // Note: Do not use arrow syntax here. Use a function expression in
        // order to use the correct value of `this` in this method (see notes below)
        // descriptor.value = function (...args: any[]) {
        //     console.log(args);
        //     console.log(this.app);
        //     console.log('The method args are ' + JSON.stringify(args));
        //     let result = originalMethod.apply(this, args);
        //     return result;
        // };

        // descriptor.value = function (...args: any[]) {
        //     console.log(args);
        //     console.log(this.app);
        //     console.log('Route set');
        //     originalMethod.apply(this);
        // };


        // descriptor.value();
        // originalMethod.apply(this, [2,3]);
        // return descriptor;
    }
}
