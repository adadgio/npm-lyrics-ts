import { App, Console }                         from '@lyrics/core';
import { BaseController }                       from '@lyrics/controller';
import { Service, Route, Controller, Inject }   from '@lyrics/annotation';
import { Request, Response, JsonResponse }      from '@lyrics/http';
import { EventDispatcher }                      from '@lyrics/event';

@Controller('/_debug')
export class DebugController extends BaseController
{
    constructor(app: App) {
        super(app);
    }

    @Route('/', {
        type: 'GET',
        firewall: 'security.service',
    })
    indexAction(request: Request)
    {
        // tail logs

        return this.renderHtml('Debug endpoint', { name: '' });
    }

    @Route('/logs', {
        type: 'GET',
        firewall: 'security.service',
    })
    otherAction()
    {
        return this.renderHtml('All logs', { name: '' });
    }
}
