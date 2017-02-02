import { App, Console }                     from './../../../@lyrics/core';
import { Route, Controller, Inject }        from './../../../@lyrics/routing';
import { BaseController }                   from './../../../@lyrics/controller';
import { Request, Response, JsonResponse }  from './../../../@lyrics/http';

@Controller('/pdf')
export class PdfController extends BaseController
{
    constructor(app: App) {
        super(app);
    }

    @Route('/test', {
        type: 'GET'
    })
    indexAction(request: Request)
    {
        let pdf = this.get('pdf.service');

        // pdf.process();
        pdf.processByQr();

        return new Response('Tested PDF');
    }
}
