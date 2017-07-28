export class ControllerMeta {
    target: Function
    classname: string;
    route: string;

    constructor(classname: string, route: string, target: Function) {
        this.classname = classname;
        this.route = route;
        this.target = target;
    }

    getBaseRoute() {
        return this.route;
    }

    getClassName() {
        return this.classname;
    }

    getTarget() {
        return this.target;
    }
}
