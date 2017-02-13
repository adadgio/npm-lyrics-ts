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
    
    getHeaders() {
        return this.req.headers;
    }
}
