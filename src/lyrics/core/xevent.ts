class XEventSingleton {
    public CLUSTER_FORK                  = 'cluster:fork';
    public CLUSTER_EXIT                  = 'cluster:exit';
    public ROUTER_REQUEST               = 'router:request';
    public ROUTER_RESPONSE              = 'router:response';
    public CONTAINER_SERVICE_INITED     = 'container:service:inited';
    public CONTAINER_SERVICE_REQUESTED  = 'container:service:requested';

    constructor() {

    }

    test() {

    }
}

export let XEvent = new XEventSingleton();
