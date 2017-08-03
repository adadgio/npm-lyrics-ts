/**
 * The route annotation
 */
import 'reflect-metadata';
import * as container       from '@lyrics/core/container';
import { InjectMetadata }   from '@lyrics/routing/metadata';

export function Inject(injectionKey: string): any {

    return function (target: Function, propertyKey: string) {
        // target is the The prototype of the class
        const defaultValue = target[propertyKey];
        let injectionValue = defaultValue;

        // check if we inject a parameter or a service
        if (injectionKey.indexOf('%') > -1) {

            // inject a configuration value
            const accessor = injectionKey.replace(/%/g, '');
            injectionValue = container.getApp().config.get(accessor);

        } else if (injectionKey.indexOf('@') > -1) {

            const serviceClassName = target.constructor.name;
            const accessor = injectionKey.replace('@', '');
            injectionValue = container.getServiceInstance(accessor);

        } else {
            // or else inject nothing
            // the injected value is the property default one if any
        }

        Object.defineProperty(target, propertyKey, {
            configurable: false,
            value: injectionValue,
            enumerable: true,
            writable: true
        });
    };
}
