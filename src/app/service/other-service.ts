import { Service, ServiceInterface } from './../../@lyrics/component';
import { Inject } from './../../@lyrics/routing';

export class OtherService
{
    /**
     * Override default service injector
     * to get default params injected in app.ts
     * as simple objects of params (typically config and route)
     */
    constructor() {
        // required when extending base services
        // super(params);
    }

    public sayBye() {
        return `Bye bye!`;
    }
}
