export class ServiceMeta {
    target: Function
    classname: string;
    name: string;
    
    constructor(classname: string, name: string, target: Function) {
        this.classname = classname;
        this.name = name;
        this.target = target;
    }

    getName() {
        return this.name;
    }

    getClassName() {
        return this.classname;
    }

    getTarget() {
        return this.target;
    }
}
