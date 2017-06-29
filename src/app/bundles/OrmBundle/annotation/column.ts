import 'reflect-metadata';

export function Column(options: any): any {
    
    return function (target: any, key: string, descriptor: any) {
        // var classConstructor = target.constructor;

        const metadata = Reflect.getMetadata('columns', target.constructor) || {};
        metadata[key] = options;

        Reflect.defineMetadata('columns', metadata, target.constructor);
    }
}
