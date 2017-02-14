import { Code } from './code';

export class Response {
    private statusCode: number;
    private content: string|number|null;

    constructor(content?: string|number|null, statusCode: number = Code.HTTP_OK) {
        this.statusCode = statusCode;
        this.content = content;
    }
    
    getContent() {
        return this.content.toString();
    }
}
