Routing
------

## General principles

Routing is defined by controller annotations above methods.

## Define simple route

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

    @Route('/home', {
        type: 'GET'
    })
    indexAction(request: Request)
    {
        let name = 'Obama';

        return this.renderHtml('<p>Hello {{name}}</p>');
    }
}
```
