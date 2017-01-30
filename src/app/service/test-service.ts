import { Service, ServiceInterface } from './../../@lyrics/component';
import { Inject } from './../../@lyrics/routing';
import { OtherService } from './other-service';

@Inject(['@other.service'])
export class TestService
{
    /**
     * Override default service injector
     * to get default params injected in app.ts
     * as simple objects of params (typically config and route)
     */
    constructor(one, two) {
        console.log(one, two);
        // required when extending base services
        // super(params);
    }
    
    public sayHi(name: string) {
        return `Greetings ${name}!`;
    }
}
