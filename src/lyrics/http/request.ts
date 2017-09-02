import * as express from 'express';

export class Request {
    private req: express.Request;

    constructor(req: express.Request) {
        this.req = req;
    }

    get(name: string)
    {
        // allow get('name') as well as get (':name')
        name = (name.indexOf(':') === 0 ) ? name.substring(1) : name;
        return (typeof this.req.params[name] !== 'undefined') ? this.req.params[name] : null;
    }

    all()
    {
        return this.req.params;
    }

    getRequest() {
        return this.req;
    }

    getBody() {
        return this.req.body;
    }

    getParam(param: string) {
        return (typeof this.req.body[param] === 'undefined') ? null : this.req.body[param];
    }

    getHeaders() {
        return this.req.headers;
    }
}
