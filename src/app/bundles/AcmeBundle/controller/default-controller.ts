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

    @Route('/getexample', {
        type: 'GET'
    })
    indexAction(request: Request)
    {
        // let req = request.getRequest();
        // let test = this.get('test.service');
        // let body = req.body;

        // // example, access app container registered service
        // // let test = this.app.get('test.service');
        // // let name = this.app.config.get('my_stuff.name');
        //
        // // do some heavy lifting and send back response
        // let greeting = this.getTitle() + ' ' + test.greet('Romain');
        //
        // // return new Response(greeting);
        // return this.render('Acme:test.twig', { greeting: greeting });

        let name = 'Obama';
        
        // render raw html or from a local template location
        // return this.render('Acme:test.twig', { name: name });
        return this.renderHtml('<p>Hello {{name}}</p>');
    }

    @Route('/postexample', {
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
    postExampleAction(request: Request)
    {
        // let req = request.getRequest();
        // console.log(req.body, req.headers);

        // .. some other logic to persist user object
        let person: Object = {
            id: request.getParam('id'),
            name: request.getParam('name'),
            surname: request.getParam('surname'),
        };

        // return a valid response object
        return new JsonResponse({ message: 'user successfuly created', person: person });
    }
}
