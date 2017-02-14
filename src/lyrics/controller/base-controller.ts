import * as fs from 'fs';
import * as Handlebars from 'handlebars';

import { App }              from './../core/app';
import { Console }          from './../core/';
import { Response, Code }   from './../http';

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

    protected renderView(location: string, data?: Object) {
        let path = `${this.app.getRootDir()}/app/views/${location.replace(':', '/')}`;

        // check that template file exists
        if (!fs.existsSync(path)) {
            Console.exception(`Template path ${path} does not exist, file not found`);
        }

        // compile template
        let contents = fs.readFileSync(path, 'utf8');
        let template: Function = Handlebars.compile(contents);
        let renderedView = template(data);

        return renderedView;
    }

    protected render(location: string, data?: Object) {
        let renderedView = this.renderView(location, data);
        return new Response(renderedView);
    }

    protected renderHtml(contents: string, data?: Object) {
        let template: Function = Handlebars.compile(contents);
        let renderedView = template(data);

        return new Response(renderedView);
    }
}
