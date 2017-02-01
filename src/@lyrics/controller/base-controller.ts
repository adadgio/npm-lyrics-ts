import * as fs from 'fs';
import * as twig from 'twig';
import { App } from './../core/app';

export class BaseController
{
    protected app: App;

    constructor(app: App) {
        this.app = app;
        this.app.log('base-controller.ts: Controller constructor called', 'whisper');
    }

    protected get(serviceName: string) {
        return this.app.get(serviceName);
    }

    protected render(template: string, data?: Object) {
        let templateLocation = `${this.app.getRootDir()}/app/views/test.twig`;


        // twig.renderFile(templateLocation, { foo: 'bar' }, (err, html) => {
        //     console.log(html);
        // });
    }
}
