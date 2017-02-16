/**
 * A simple yet demonstrative service.
 */
import { Service, ServiceInterface } from './../../../../lyrics/component';
import { Inject } from './../../../../lyrics/routing';

@Inject([
    { age:   '%my_stuff.age%' }, // value from config.*.yml
    { other: '@other.service' },
])
export class TestService extends Service
{
    /**
     * Required when extending base services
     * you need this for proper DI injection
     */
    constructor() {
        super();
    }

    public greet(name: string) {
        let bye = this.injected.other.sayBye();
        let info = `${name} (${this.injected.age} years old)`;

        return `Greetings ${info}! Also sorry but ${bye}`;
    }
}
