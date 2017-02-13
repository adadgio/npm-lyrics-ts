export class Response {
    private content: string|number|null;

    constructor(content?: string|number|null) {
        this.content = content;
    }
    
    getContent() {
        return this.content.toString();
    }
}
