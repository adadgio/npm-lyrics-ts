export class Request {
    private req: any;
    
    constructor(req: any) {
        this.req = req;
    }

    getRequest() {
        return this.req;
    }
}
