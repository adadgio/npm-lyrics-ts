/**
 * Service definition annotation.
 */
import 'reflect-metadata';
import { ServiceMeta } from '@lyrics/annotation';

type ServiceDefinition = {

};

const DefaultServiceDefinition:ServiceDefinition = {
    one: 2
};

export function Service(name: string, opts: ServiceDefinition = DefaultServiceDefinition) {

    return function (target: any) {
        const className = target.prototype.constructor.name;
        const metadata = Reflect.getMetadata('serviceMetadata', target) || new ServiceMeta(className, name, target);

        Reflect.defineMetadata('serviceMetadata', metadata, target);
        // return target;
    };
}
