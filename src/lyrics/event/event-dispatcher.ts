import * as events from 'events';
// import { Service } from '@lyrics/annotation';

/**
 * The event dispatcher.
 */
// @Service('event.dispatcher')
class EventDispatcherSingleton extends events.EventEmitter
{
    constructor()
    {
        super();
    }
}

export let EventDispatcher = new EventDispatcherSingleton();
