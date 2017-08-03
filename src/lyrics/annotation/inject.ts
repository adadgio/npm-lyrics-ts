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

            // inject a configuration value config values can
            // be injected staright away into the property because they
            // are available already
            const accessor = injectionKey.replace(/%/g, '');
            injectionValue = container.getApp().config.get(accessor);

            Object.defineProperty(target, propertyKey, {
                configurable: false,
                value: injectionValue,
                enumerable: true,
                writable: true
            });

        } else if (injectionKey.indexOf('@') > -1) {

            const serviceClassName = target.constructor.name;
            const cleanInjectionKey = injectionKey.replace('@', '');
            container.addServiceInjection(target, cleanInjectionKey, propertyKey);
            
        } else {
            // or else inject nothing
            // the injected value is the property default one if any
        }
    };
}
