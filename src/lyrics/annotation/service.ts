/**
 * Service definition annotation.
 */
import 'reflect-metadata';
import * as container  from '@lyrics/core/container';
import { ServiceMeta } from '@lyrics/annotation';

type ServiceDefinition = {
    autoinit: boolean;
};

const DefaultServiceDefinition:ServiceDefinition = {
    autoinit: false,
};

export function Service(serviceName: string, opts: ServiceDefinition = DefaultServiceDefinition) {

    return function (target: any) {
        // const className = target.prototype.constructor.name;
        const service = target;
        container.registerService(serviceName, service);

        if (typeof opts.autoinit !== undefined && true === opts.autoinit) {
            container.initService(serviceName);
        }
    };
}
