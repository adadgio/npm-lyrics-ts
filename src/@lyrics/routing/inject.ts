/**
 * The route annotation
 */
import 'reflect-metadata';
import * as container from './container';

// const requiredMetadataKey = Symbol('Inject');

export function Inject(target: any, key : string | symbol, index : number): any {
    let metadataKey = `__log_${key}_parameters`;
    // console.log(metadataKey);
    // console.log(target, key, index);

    // let paramInfo = target[]

    // let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, key) || [];
    // console.log(existingRequiredParameters);

    // if (Array.isArray(target[metadataKey])) {
    //     target[metadataKey].push(index);
    // } else {
    //     target[metadataKey] = [index];
    // }
}
