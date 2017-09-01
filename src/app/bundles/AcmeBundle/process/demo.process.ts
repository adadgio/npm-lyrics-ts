import { Process }          from '@lyrics/annotation';
import { BaseProcess }      from '@lyrics/component';
import { EventDispatcher }  from '@lyrics/event';

@Process('demo.process')
export class DemoProcess extends BaseProcess
{

    constructor()
    {
        super(300); // loop each 500ms
    }

    start()
    {

    }

    loop()
    {
        const millis = process.hrtime();
    }
    
    stop(): boolean
    {
        return false;
    }
}
