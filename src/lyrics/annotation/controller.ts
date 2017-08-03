/**
 * The @Controller annotation function.
 */
import * as container       from '@lyrics/core/container';
import { ControllerMeta }   from '@lyrics/annotation';

export function Controller(route: string): any {

    return function (target: Function) {
        const controller = target;

        const className = target.prototype.constructor.name;
        const metadata = Reflect.getMetadata('controllerMetadata', target) || new ControllerMeta(className, route, target);
        
        Reflect.defineMetadata('controllerMetadata', metadata, target);
   };
}
