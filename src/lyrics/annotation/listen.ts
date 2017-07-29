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
        
        // there is a problem because if the annotation
        // is on a serivice its not yet instantiated at this point
        // so we need to register a listener first and it will be
        // attached a little bit later by ?? who ?
        const fn: Function = target[methodName];
        EventDispatcher.registerCustomListener(eventName, fn, target);
    }
}
