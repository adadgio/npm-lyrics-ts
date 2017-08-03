/**
 * A simple yet demonstrative service.
 */
import { Service, Inject }  from '@lyrics/annotation';
import { BaseService }      from '@lyrics/component';
import { Listen }           from '@lyrics/annotation';
import { EventDispatcher }  from '@lyrics/event';

@Service('second.service')
export class SecondService extends BaseService
{
    @Inject('%my_stuff.age%')
    age: number;
    
    /**
     * Required when extending base service.
     */
    constructor()
    {
        super();
    }

    onInit()
    {

    }

    @Listen('test.event')
    test(e: any)
    {
        const event = e;
        this.doSomethingWithAge();
    }

    doSomethingWithAge()
    {
        console.log(`Did something with age: ${this.age}`);
    }

    greet(txt: string)
    {
        return `Greetings Gandalf, ${txt}`;
    }
}
