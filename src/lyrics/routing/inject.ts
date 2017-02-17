/**
 * The route annotation
 */
import 'reflect-metadata';
import * as container       from '@lyrics/core/container';
import { InjectMetadata }   from '@lyrics/routing/metadata';

// const requiredMetadataKey = Symbol('Inject');
export function Inject(dependencies: Array<Object>) {

    return function (target: any, decoratedPropertyName? : string): void {
         let targetType : Function;

        if (typeof target === 'function' && decoratedPropertyName === undefined) {
            targetType = target;
        } else {
            targetType = target.constructor;
        }

        let serviceClassName = target.prototype.constructor.name;

        // for each [{ other: '@ither.service' }]
        for (let dependecy of dependencies) {
            // then { other: '@other.service' }
            for (let propertyName in dependecy) {
                let injectionKey = dependecy[propertyName];
                container.addServiceInjection(serviceClassName, injectionKey, propertyName);
            }
        }
    };
}
