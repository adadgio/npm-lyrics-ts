import { App, Console }                     from './../../../../lyrics/core';
import { BaseController }                   from './../../../../lyrics/controller';
import { Route, Controller, Inject }        from './../../../../lyrics/routing';
import { Request, Response, JsonResponse }  from './../../../../lyrics/http';

@Controller('/acme')
export class AcmeController extends BaseController
{
    constructor(app: App) {
        super(app);
    }

    @Route('/index', {
        type: 'GET'
    })
    indexAction(request: Request)
    {
        let test = this.get('test.service');

        // return a valid response object
        return new Response('Hello acme world');
    }

    @Route('/demo', {
        type: 'POST',
        requirements: {
            body: {
                id: 'number',
                surname: 'string',
                name: ['string', 'null'],
            },
            headers: {
                Token: 'string',
            }
        }
    })
    acmeAction(request: Request)
    {
        let req = request.getRequest();

        // return a valid response object
        return new JsonResponse({ message: 'Hello acme world' });
    }
}
