/**
 * A simple yet demonstrative service.
 */
import { Service, ServiceInterface } from './../../../../lyrics/component';
import { Inject } from './../../../../lyrics/routing';

@Inject([
    { age:   '%my_stuff.age%' },
    { other: '@other.service' },
])
export class TestService extends Service
{
    /**
     * Override default service injector
     * to get default params injected in app.ts
     * as simple objects of params (typically config and route)
     */
    constructor() {
        // required when extending base services
        // you need this for proper di injection
        super();
    }

    public greet(name: string) {
        let bye = this.injected.other.sayBye();
        let info = `${name} (${this.injected.age} years old)`;

        return `Greetings ${info}! Also sorry but ${bye}`;
    }
}
