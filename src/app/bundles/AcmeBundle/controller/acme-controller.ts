import { App, Console }                     from '@lyrics/core';
import { BaseController }                   from '@lyrics/controller';
import { Service, Route, Controller, Inject }        from '@lyrics/annotation';
import { Request, Response, JsonResponse }  from '@lyrics/http';

@Controller('/acme')
export class AcmeController extends BaseController
{
    constructor(app: App) {
        super(app);
    }

    @Route('/index', { type: 'GET' })
    indexAction(request: Request)
    {
        // access a service instance
        let test = this.get('test.service');

        // access full config or config value
        let conf = this.app.config.all();
        let item = this.app.config.get('my_stuff.age');

        return new Response(`Acme demo ${item}`);
    }

    @Route('/other', { type: 'GET' })
    otherAction()
    {
        return new JsonResponse({ message: 'Acme Json' });
    }
}
