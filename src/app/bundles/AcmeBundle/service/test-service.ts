/**
 * A simple yet demonstrative service.
 */
import { Service, Inject }  from '@lyrics/annotation';
import { BaseService }      from '@lyrics/component';
import { Listen }           from '@lyrics/annotation';
import { EventDispatcher }  from '@lyrics/event';

@Service('test.service')
export class TestService extends BaseService
{
    @Inject('%my_stuff.age%')
    injectedValue: number;

    @Inject('@other.service')
    testService: any;

    /**
     * Required when extending base services you
     * need this for proper DI injection, but service
     * deps are not injected yet ("this.injected" is empty).
     */
    constructor()
    {
        super();
    }
    
    /**
     * Depencies will be available from here.
     */
    onInit()
    {

    }

    @Listen('test.event')
    test(e: any)
    {
        const event = e;
        this.doSomethingWithAge();
    }

    testInjection()
    {
        console.log(this.injectedValue);
        console.log(this.testService);
    }

    doSomethingWithAge()
    {
        // console.log(`Did something with age: ${this.injected.age}`);
    }

    greet(txt: string)
    {
        // let bye = this.injected.other.sayBye();
        return `Greetings Gandalf, ${txt}`;
    }
}
