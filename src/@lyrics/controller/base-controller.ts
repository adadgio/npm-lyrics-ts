export class BaseController
{
    protected app;
    protected router;
    
    constructor(app, router) {
        this.app = app;
        this.router = router;
    }

    public setRoutes()
    {

    }
}
