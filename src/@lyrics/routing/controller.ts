/**
 * The @Controller annotation function.
 */
import * as container from './container';
import { ControllerMetadata } from './metadata';

export function Controller(route: string): any {
    return function (object: Function) {

        // the name of the class as defined
        let className = object.prototype.constructor.name;
        const metadata = new ControllerMetadata(className, route, object);

        container.addControllerMeta(metadata);

   };
}
