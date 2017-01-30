import { App } from './../core/app';

export class BaseController
{
    protected app: App;

    constructor(app: App) {
        this.app = app;
        this.app.log('Base controller constructed');
    }

    protected get(serviceName: string) {
        console.log(serviceName);
        this.app.log('Requested service ' + serviceName);
        return this.app.get(serviceName);
    }
}
