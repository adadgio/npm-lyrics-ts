import * as fs from 'fs';
import * as twig from 'twig';
import { App } from './../core/app';

export class BaseController
{
    protected app: App;

    constructor(app: App) {
        this.app = app;
    }

    protected get(serviceName: string) {
        return this.app.get(serviceName);
    }

    private getChildClassName() {
        return this.constructor.name;
    }

    protected render(template: string, data?: Object) {
        let templateLocation = `${this.app.getRootDir()}/app/views/test.twig`;
        // twig.renderFile(templateLocation, { foo: 'bar' }, (err, html) => {
        //
        // });
    }
}
