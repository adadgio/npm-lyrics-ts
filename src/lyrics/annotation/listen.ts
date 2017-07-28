/**
 * The route annotation
 */
import * as container from '@lyrics/core/container';
import { Console }          from '@lyrics/core';
import { EventDispatcher }  from '@lyrics/event';

export function Listen(eventName: string): any {

    return function (target: Function, methodName: string, descriptor: TypedPropertyDescriptor<any>) {
        // save a reference to the original method
        let originalMethod = descriptor.value;

        // Console.warn(`listen.ts listening to ${eventName}`);
        EventDispatcher.on(eventName, (e) => {
            originalMethod.apply(target, [e]);
        });
        
        // descriptor.value = function (...args: any[]) {
        //     let result = originalMethod.apply(target, args);
        //     return result;
        // };

        // optional, code works without this
        // return descriptor;
    }
}
