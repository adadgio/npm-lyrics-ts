/**
 *
 */
import * as container from './container';

export function Controller(route: string): any {
    return function (target: Function) {

        let metadata = {
            route: route,
            target: target,
        }
        
        container.addControllerRouteMetaData(metadata);
   };
}
