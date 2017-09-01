/**
 * Process startup runner.
 */
import 'reflect-metadata';
import * as container  from '@lyrics/core/container';

export function Process(processName: string, opts: any = {}) {

    return function (target: any) {
        const process = target;
        container.registerProcess(processName, target);
    };
}
