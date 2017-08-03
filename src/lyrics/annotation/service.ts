/**
 * Service definition annotation.
 */
import 'reflect-metadata';
import * as container  from '@lyrics/core/container';
import { ServiceMeta } from '@lyrics/annotation';

type ServiceDefinition = {

};

const DefaultServiceDefinition:ServiceDefinition = {
    one: 2
};

export function Service(serviceName: string, opts: ServiceDefinition = DefaultServiceDefinition) {

    return function (target: any) {
        // const className = target.prototype.constructor.name;
        const service = target;
        container.registerService(serviceName, service);
    };
}
