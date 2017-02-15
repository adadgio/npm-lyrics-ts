Routing
------

## General principles

Routing is defined by controller annotations above methods.

## Define simple routes

You must create a controller to define a route. Your base controller doesn't have to extend
the base controller but it provide ready-made methods to render views and html.

The controller method must return a response object.

```node
// app/AcmeBundle/controller/default-controller.ts
import { App }                from './../../../../lyrics/core';
import { Route, Controller }  from './../../../../lyrics/routing';
import { Request, Response }  from './../../../../lyrics/http';
import { BaseController }     from './../../../../lyrics/controller';

// define a base route for all
// future controller methods
@Controller('/default')
export class DefaultController extends BaseController
{
    // inject app object as required
    // when extending the base controller
    constructor(app: App) {
        super(app);
    }

    @Route('/get-demo', {
        type: 'GET'
    })
    indexAction()
    {
        let name = 'Obama';

        return this.renderHtml('<p>Hello {{name}}</p>');
    }
}
```

## Request and responses

Here is a more complex example to define route requirements and fetching data from request.

```node
// app/AcmeBundle/controller/default-controller.ts
import { App }                      from './../../../../lyrics/core';
import { Route, Controller }        from './../../../../lyrics/routing';
import { Request, JsonResponse }    from './../../../../lyrics/http';
import { BaseController }           from './../../../../lyrics/controller';

// define a base route for all
// future controller methods
@Controller('/default')
export class DefaultController extends BaseController
{
    // inject app object as required
    // when extending the base controller
    constructor(app: App) {
        super(app);
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
    postAction(request: Request)
    {
        // console.log(req.body, req.headers);
        // ...some other logic to persist user object
        let person: Object = {
            id: request.getParam('id'),
            name: request.getParam('name'),
            surname: request.getParam('surname'),
        };

        // return a valid response object
        return new JsonResponse({ message: 'user successfuly created', person: person });;
    }
}
```
