Controllers
======

Request and response
------

Controllers must extend `BaseController` and methods must return `ResponseInterface` objects.

```node
import { App }                              from './../../../../lyrics/core';
import { Route, Controller }                from './../../../../lyrics/routing';
import { Request, Response, JsonResponse }  from './../../../../lyrics/http';
import { BaseController }                   from './../../../../lyrics/controller';

@Controller('/default')
export class DefaultController extends BaseController
{
    @Route('/get-demo', {
        type: 'GET'
    })
    indexAction(request: Request)
    {
        // return new JsonResponse({ message: 'hello' });
        return new Response('hello');
    }
}
```

See also: [routing components](./ROUTING.md)

Rendering views and templating
------

Template views live in `src/view` directory.

```bash
views/
    Acme/
        test.tpl
```

```html
// test.tpl
<p>{{ name }}</p>
```

Controllers can use parent `BaseController` rendering methods.

Render text or html:

```node
@Route('/get-demo', {
    type: 'GET'
})
indexAction()
{
    // render straigh html
    return this.renderHtml('<p>Hello {{name}}</p>');
}
```

Render view from a template file:

```node
@Route('/get-demo', {
    type: 'GET'
})
indexAction()
{
    // render from a local *.tpl file in view/ directory
    return this.render('Acme:test.tpl');
}
```

Retrieve output of template before rendering and craft response.

```node
@Route('/get-demo', {
    type: 'GET'
})
indexAction()
{
    let html = this.renderView('Acme:test.tpl');
    return new Response(html);
}
```
