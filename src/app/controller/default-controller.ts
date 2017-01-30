import { App, Console }                     from './../../@lyrics/core';
import { Route, Controller, Inject }        from './../../@lyrics/routing';
import { BaseController }                   from './../../@lyrics/controller';
import { Request, Response, JsonResponse }  from './../../@lyrics/http';

@Controller('/default')
export class DefaultController extends BaseController
{
    constructor(app: App) {
        super(app);
    }

    @Route('/hello', {
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

        // return a valid response object
        return new Response(greeting);
        // return new JsonResponse({ greeting: greeting });
    }

    private getTitle() {
        return 'Professor';
    }
}
