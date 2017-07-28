/**
 * Process service annotation
 */
import 'reflect-metadata';

type ProcessOptions = {
    name?: string;
};

export function Process(options: ProcessOptions) {

    return function (target: any, decoratedPropertyName? : string): void {
        const metadata = Reflect.getMetadata('tableName', target) || null;

        Reflect.defineMetadata('process', true, target);
        Reflect.defineMetadata('name', options.name, target);
    };
}
