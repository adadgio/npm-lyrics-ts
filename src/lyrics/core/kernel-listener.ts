import { KernelEvents } from '@lyrics/core';

class KernelListenerSingleton {
    constructor() {

    }

    on(event: string, then: Function) {
        KernelEvents.on(event, (args) => {
            then(args);
        });
    }
}

export let KernelListener = new KernelListenerSingleton();
