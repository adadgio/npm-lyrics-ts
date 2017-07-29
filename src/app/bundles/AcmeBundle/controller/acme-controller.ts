import { App, Console }                         from '@lyrics/core';
import { BaseController }                       from '@lyrics/controller';
import { Service, Route, Controller, Inject }   from '@lyrics/annotation';
import { Request, Response, JsonResponse }      from '@lyrics/http';
import { EventDispatcher }                      from '@lyrics/event';

@Controller('/acme')
export class AcmeController extends BaseController
{
    constructor(app: App) {
        super(app);
    }

    @Route('/index', {type: 'GET'})
    indexAction(request: Request)
    {
        // access a service instance
        let testService = this.get('test.service');

        // access config values
        let conf = this.app.config.all();
        let item = this.app.config.get('my_stuff.age');

        EventDispatcher.emit('test.event', {qsd: "3"});

        const name = 'Bilbo Baggins';
        return this.renderHtml('<p>Hello {{name}}</p>', { name: name });
    }

    @Route('/text', {type: 'GET'})
    otherAction()
    {
        return new Response(`Acme response text demo.`);
    }
}
