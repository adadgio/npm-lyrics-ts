/**
 * An other simple service.
 */
 import { Service, Inject } from '@lyrics/annotation';
 import { BaseService }     from '@lyrics/component';
 import { SecondService }   from './second-service';

@Service('first.service')
export class OtherService extends BaseService
{
    @Inject('@second.service')
    secondService: SecondService;

    constructor()
    {
        super();
    }

    onInit()
    {

    }

    sayBye()
    {
        return `Bye bye!`;
    }
}
