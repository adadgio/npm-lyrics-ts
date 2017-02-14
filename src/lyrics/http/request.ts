import * as express from 'express';

export class Request {
    private req: express.Request;

    constructor(req: express.Request) {
        this.req = req;
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
