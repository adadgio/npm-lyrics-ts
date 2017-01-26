import { BaseController } from './../../@lyrics/controller';

export class DefaultController extends BaseController
{
    constructor(app, router) {
        super(app, router);
    }

    /**
     * Define controller routes here
     * This method is required as part of
     * the base controller and is called by app kernel.
     */
    public setRoutes()
    {
        this.indexAction();
    }
    
    @Route()
    private indexAction()
    {
        // example, access app container registered service
        let test = this.app.get('test.service');
        let name = this.app.config.get('my_stuff.name');

        this.router.get('/', (req, res, next) => {
            // add some heavy logic...
            let greeting = test.sayHi(name);

            // send back a response
            res.json({ message: 'It works!', value: greeting });
        });
    }
}
