import { Route, Controller } from './../../@lyrics/routing';
import { BaseController } from './../../@lyrics/controller';

@Controller('/default')
export class DefaultController extends BaseController
{
    constructor(app, router) {
        super(app, router);
    }
    
    @Route('/hello')
    indexAction(truc: string)
    {
        // example, access app container registered service
        // let test = this.app.get('test.service');
        // let name = this.app.config.get('my_stuff.name');



        // this.router.get('/', (req, res, next) => {
        //     // add some heavy logic...
        //     let greeting = test.sayHi(name);
        //
        //     // send back a response
        //     res.json({ message: 'It works!', value: greeting });
        // });

        return 48;
    }
}
