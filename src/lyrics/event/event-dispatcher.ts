import * as events      from 'events';
import * as container   from '@lyrics/core/container';
import { Console }      from '@lyrics/core';

function getFnName(fn) {
    let ret = fn.toString();
    // ret = ret.substr('function '.length);
    // ret = ret.substr(0, ret.indexOf('('));
    return ret;
}

/**
 * The event dispatcher.
 */
class EventDispatcherSingleton extends events.EventEmitter
{
    _listeners: Array<any> = [];

    constructor()
    {
        super();
    }

    startListening()
    {
        for (let listener of this._listeners) {

            // top avoid loosing the "this" context we must
            // find the class/service instance from the container
            const className = listener.target.constructor.name;
            const serviceId = container.getServiceIdByClassName(className);
            const serviceInstance = container.getServiceInstance(serviceId);

            this.on(listener.eventName, (e) => {
                // excute the method withing the correct instance
                // so that "this" reference is not lost!
                serviceInstance[listener.fn.name](e);
            });
        }
    }

    registerCustomListener(eventName: string, fn: Function, target: any)
    {
        // target ref (see listen annotation) is necessary not to loose "this" context
        this._listeners.push({ eventName: eventName , fn: fn , target: target });
    }

    removeCustomListener(eventName: string)
    {
        // @todo Loop through listener, find thos wo have that name
        // and remove it
        // const fn =
        // this.removeListener(eventName, );
    }
}

export let EventDispatcher = new EventDispatcherSingleton();
