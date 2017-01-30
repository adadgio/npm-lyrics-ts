import { App }                  from './../../@lyrics/core';
import { Route, Controller }    from './../../@lyrics/routing';
import { BaseController }       from './../../@lyrics/controller';
import { Request, Response }    from './../../@lyrics/http';

export class TestController extends BaseController
{
    constructor(app: App) {
        super(app);
    }

    indexAction()
    {
        //  let test = this.app.get('test.service');
        //  let name = this.app.config.get('my_stuff.name');
         //
        //  let greeting = test.sayHi('Edwards');
        //  console.log(greeting);
         //
        //  this.app.router.get('/test', (req, res, next) => {
        //      res.json({ greeting: greeting });
        //  });
    }
}
