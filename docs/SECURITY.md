Security
======

Defining routes
------

The framework comes with a firewall annotation that can delegate security to your own service.

```node
// create a security service
/**
 * A simple yet demonstrative service.
 */
import * as express         from 'express';
import { Service, Inject }  from '@lyrics/annotation';
import { BaseService }      from '@lyrics/component';

@Service('security.service')
export class SecurityService extends BaseService
{
    /**
     * From here dependencies marked in service class
     * annotations above were successfuly injected by the
     * container ("this.injected" is not empty).
     */
    onInit()
    {

    }

    /**
     * If you use this to secure your route this method
     * will be required (or you will be warned in a harsh way)
     * Returning anything that true (a string) will be your error
     *
     * undefined(void), null or true will trigger a success
     * false or array of errors will trigger a failure
     */
     checkCrendentials(request: express.Request)
     {
         // do someting with the request
         return false;
     }

     /**
      * This will be called if checkCrendentials returns false.
      * If you don't do anything the router will response for you
      * with an unthaurized response.
      * @todo Not done in router bridge utils yet
      */
     onAuthenticationFailure()
     {

     }

     /**
      * This will be called if checkCrendentials returns true.
      * @todo Not done in router bridge utils yet
      */
     onAuthenticationSuccess()
     {

     }
}
```

Then just use it in an endpoint.

```node
// some controllers endpoint

@Route('/', {
    type: 'GET',
    firewall: 'security.service',
})
indexAction(request: Request)
{
    // tail logs

    return this.renderHtml('Debug endpoint', { name: '' });
}
```

[&laquo; Routing](./../ROUTING.md)

[Services &raquo;](./SERVICES.md)
