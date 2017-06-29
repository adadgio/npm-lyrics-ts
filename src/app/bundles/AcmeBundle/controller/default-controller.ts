import { App, Console }                     from '@lyrics/core';
import { Route, Controller, Inject }        from '@lyrics/routing';
import { Request, Response, JsonResponse }  from '@lyrics/http';
import { BaseController }                   from '@lyrics/controller';
import { User }                             from '../../OrmBundle/model';

@Controller('/default')
export class DefaultController extends BaseController
{
    constructor(app: App) {
        super(app);
    }

    @Route('/get-demo', {
        type: 'GET'
    })
    indexAction()
    {
        // function sleep(ms) {
        //     var start = new Date().getTime(), expire = start + ms;
        //     while (new Date().getTime() < expire) { }
        //     return;
        // }
        let orm = this.get('orm.service');

        console.log(orm);
        let user = new User();
        user.setName('Romain');
        orm.persist(user).then(model => {
            console.log(model);
        });

        let name = 'Obama';
        return this.renderHtml('<p>Hello {{name}}</p>', { name: name });
    }

    @Route('/post-demo', {
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
        // console.log(req.body, req.headers);
        // ...some other logic to persist user object
        let person: Object = {
            id: request.getParam('id'),
            name: request.getParam('name'),
            surname: request.getParam('surname'),
        };

        // return a valid response object
        return new JsonResponse({ message: 'user successfuly created', person: person });
    }
}
