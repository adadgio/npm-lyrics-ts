/**
 * An other simple service.
 */
 import { Service, Inject } from '@lyrics/annotation';
 import { BaseService }     from '@lyrics/component';

@Service('other.service')
export class OtherService extends BaseService
{
    constructor()
    {
        super();
    }
    
    onInit()
    {

    }

    public sayBye()
    {
        return `Bye bye!`;
    }
}
