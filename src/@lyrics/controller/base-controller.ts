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
}
