import { App, Console }                     from '@lyrics/core';
import { Route, Controller, Inject }        from '@lyrics/routing';
import { Request, Response, JsonResponse }  from '@lyrics/http';
import { BaseController }                   from '@lyrics/controller';

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

    @Route('/test-orm', {
        type: 'GET'
    })
    testOrmAction()
    {
        let orm = this.get('orm.service');

        // let sequelize = orm.sequelize();
        //
        // let romain = orm.create('user', { name: "Romain" });
        //
        // sequelize.query("SELECT * FROM `test` LIMIT 10", { type: sequelize.QueryTypes.SELECT})
        //     .then(function(rows) {
        //         console.log(rows);
        //         // We don't need spread here, since only the results will be returned for select queries
        //     })

        return this.renderHtml('Orm type: {{type}}', { type: 'unknown' });
    }
}
