/**
 * The route annotation
 */
import 'reflect-metadata';
import * as container from './../core/container';
import { InjectMetadata } from './metadata';

// const requiredMetadataKey = Symbol('Inject');
export function Inject(injectionKeys: Array<string>) {

    return function (target: any, decoratedPropertyName? : string): void {
         let targetType : Function;

        if (typeof target === 'function' && decoratedPropertyName === undefined) {
            targetType = target;
        } else {
            targetType = target.constructor;
        }

        let serviceClassName = target.prototype.constructor.name;

        for (let injectKey of injectionKeys) {
            container.addServiceInjection(serviceClassName, injectKey);
        }
    };
}
