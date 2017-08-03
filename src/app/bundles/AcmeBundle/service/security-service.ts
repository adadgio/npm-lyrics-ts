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
     * Required when extending base service.
     */
    constructor()
    {
        super();
    }

    /**
     * From here injected dependencies from
     * other services or config are successfuly injected.
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
