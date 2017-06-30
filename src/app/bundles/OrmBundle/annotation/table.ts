import 'reflect-metadata';

export function Table(namespace: string, persistent: boolean = true): any {

    return function (target: any) {
        const metadata = Reflect.getMetadata('tableName', target) || null;

        Reflect.defineMetadata('tableName', metadata, target);
        Reflect.defineMetadata('isPersistent', true, target);
    }
}
