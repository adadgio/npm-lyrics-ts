/**
 * A simple yet demonstrative service.
 */
import { Service, Inject }  from '@lyrics/annotation';
import { BaseService }      from '@lyrics/component';
import { Listen }          from '@lyrics/annotation';
import { EventDispatcher }  from '@lyrics/event';

@Service('test.service')
@Inject([
    { age: '%my_stuff.age%' },      // value from config.*.yml
    { other: '@other.service' },
])
export class TestService extends BaseService
{
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
     * From here dependencies marked in service class
     * annotations above were successfuly injected by the
     * container ("this.injected" is not empty).
     */
    onInit()
    {

    }
    
    @Listen('test')
    test(e)
    {
        console.log('Just received an event !', e);
        this.greet('Hey!, just received event!');
    }

    public greet(name: string)
    {
        let bye = this.injected.other.sayBye();
        let info = `${name} (${this.injected.age} years old)`;

        return `Greetings ${info}! Also sorry but ${bye}`;
    }
}
