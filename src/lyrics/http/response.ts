import { Code } from '@lyrics/http';

export class Response
{
    protected statusCode: number;
    protected content: string|number|null;

    constructor(content?: string|number|null, statusCode: number = Code.HTTP_OK) {
        this.statusCode = statusCode;
        this.content = content;
    }

    getCode()
    {
        return this.statusCode;
    }

    getContent()
    {
        return this.content.toString();
    }
}
