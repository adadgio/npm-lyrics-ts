import * as events from 'events';

class KernelEventsSingleton extends events.EventEmitter {
    constructor() {
        super();
    }
}

export let KernelEvents = new KernelEventsSingleton();
