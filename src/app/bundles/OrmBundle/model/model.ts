export interface ModelInterface {
    id: string|number;
    getId: Function;
    setId: Function;
    [prop: string]: any;
}

export class Model implements ModelInterface {
    id: string|number;

    getId() {
        return this.id;
    }

    setId(id: string|number) {
        this.id = id;
        return this;
    }
};
