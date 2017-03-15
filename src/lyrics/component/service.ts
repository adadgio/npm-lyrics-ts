import { ServiceInterface } from './service-interface';

export class Service implements ServiceInterface {
    protected injected: any;

    constructor() {
        this.injected = {};
    }

    injector(...args: any[]) {
        if (arguments.length === 0) {
            return;
        }

        // convert arguments into an array
        // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/arguments
        let thisProp: any = {};
        let arrArgs = [].slice.call(arguments);

        for (let prop in arrArgs[0]) {
            let injectedObjectOrParam = arrArgs[0][prop];
            this.injected[prop] = injectedObjectOrParam;
        }
    }
}
