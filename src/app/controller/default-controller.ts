import { App }                          from './../../@lyrics/core';
import { Route, Controller, Inject }    from './../../@lyrics/routing';
import { BaseController }               from './../../@lyrics/controller';
import { Request, Response }            from './../../@lyrics/http';

@Controller('/default')
export class DefaultController extends BaseController
{
    constructor(app: App) {
        super(app);
    }

    @Route('/hello', {
        type: 'GET'
    })
    indexAction(name: string)
    {
        console.log('EXECUTED METHOD');

        let test = this.get('test.service');
        // test.sayHi('sdf');
        

        // console.log(this.app);
        // example, access app container registered service
        // let test = this.app.get('test.service');
        // let name = this.app.config.get('my_stuff.name');
        // console.log(this.app);

        return this.test(3);
    }

    private test(a: number) {
        return a * 54;
    }
}
