export class InjectMetadata {
    private injectionKey: string;

    constructor(injectionKey: string) {
        this.injectionKey = injectionKey;
    }
    
    getInjectionKey() {
        return this.injectionKey;
    }
}
