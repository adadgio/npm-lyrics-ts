import { Service, ServiceInterface } from './../../@lyrics/component';

export class TestService extends Service implements ServiceInterface
{
    /**
     * Override default service injector
     * to get default params injected in app.ts
     * as simple objects of params (typically config and route)
     */
    constructor(params: any) {
         // required when extending base services
        super(params);
    }

    public sayHi(name: string) {
        return `Greetings ${name}!`;
    }
}
