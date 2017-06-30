/**
 * An other simple service.
 */
import { Service, ServiceInterface }    from '@lyrics/component';
import { Process }                      from '@lyrics/annotation';
import { ProcessManager }               from '@lyrics/component';

@Process({
    name: 'somelistener'
})
export class ListenerService extends ProcessManager
{
    
}
