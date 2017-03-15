/**
 * A simple yet demonstrative service.
 */
import { Inject } from '@lyrics/routing';
import { Service, ServiceInterface } from '@lyrics/component';

@Inject([
    { age:   '%my_stuff.age%' }, // value from config.*.yml
    { other: '@other.service' },
])
export class TestService extends Service
{
    /**
     * Required when extending base services you
     * need this for proper DI injection, but service
     * deps are not injected yet ("this.injected" is empty).
     */
    constructor() {
        super();
    }

    /**
     * From here dependencies marked in service class
     * annotations above were successfuly injected by the
     * container ("this.injected" is not empty).
     */
    onInit() {

    }

    public greet(name: string) {
        let bye = this.injected.other.sayBye();
        let info = `${name} (${this.injected.age} years old)`;

        return `Greetings ${info}! Also sorry but ${bye}`;
    }
}
