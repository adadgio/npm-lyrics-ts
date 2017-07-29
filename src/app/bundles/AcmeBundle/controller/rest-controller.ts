import { App, Console }                     from '@lyrics/core';
import { Route, Controller, Inject }        from '@lyrics/annotation';
import { Request, Response, JsonResponse }  from '@lyrics/http';
import { BaseController }                   from '@lyrics/controller';

@Controller('/rest')
export class RestController extends BaseController
{
    constructor(app: App) {
        super(app);
    }

    @Route('/get', {
        type: 'GET'
    })
    indexAction()
    {
        return new JsonResponse({ message: 'REST get route action.' }, 404);
    }

    @Route('/post', {
        type: 'POST',
        requirements: {
            body: {
                id: 'number',
                surname: 'string',
                name: ['string', 'null'],
            },
            headers: { Token: 'string' }
        }
    })
    createAction(request: Request)
    {
        // ...some other logic to persist user object
        let person: Object = {
            id: request.getParam('id'),
            name: request.getParam('name'),
            surname: request.getParam('surname'),
        };

        // return a valid response object
        return new JsonResponse({ message: 'REST post route action.', person: person });
    }
}
