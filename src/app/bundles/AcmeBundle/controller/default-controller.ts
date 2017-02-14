import { App, Console }                     from './../../../../lyrics/core';
import { Route, Controller, Inject }        from './../../../../lyrics/routing';
import { Request, Response, JsonResponse }  from './../../../../lyrics/http';
import { BaseController }                   from './../../../../lyrics/controller';

@Controller('/default')
export class DefaultController extends BaseController
{
    constructor(app: App) {
        super(app);
    }

    @Route('/hi', {
        type: 'GET'
    })
    indexAction(request: Request)
    {
        let req = request.getRequest();
        let test = this.get('test.service');
        let body = req.body;

        // example, access app container registered service
        // let test = this.app.get('test.service');
        // let name = this.app.config.get('my_stuff.name');

        // do some heavy lifting and send back response
        let greeting = this.getTitle() + ' ' + test.greet('Romain');

        // return new Response(greeting);
        return this.render('Acme:test.twig', { greeting: greeting });
    }
    
    @Route('/hello', {
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
    otherAction(request: Request)
    {
        let req = request.getRequest();
        // console.log(req.body, req.headers);

        // return a valid response object
        return new JsonResponse({ message: 'Hello world from post request' });
    }

    private getTitle() {
        return 'Professor';
    }
}
