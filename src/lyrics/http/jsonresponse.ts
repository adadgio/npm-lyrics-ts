import { Response, Code } from '@lyrics/http';

export class JsonResponse
{
    protected statusCode: number;
    protected content: any;

    constructor(content?: any, statusCode: number = Code.HTTP_OK) {
        // super(content, statusCode);
        this.statusCode = statusCode;
        this.content = (content === null) ? {} : content;
    }
    
    getCode()
    {
        return this.statusCode;
    }

    getJsonContent()
    {
        return this.content;
    }
}
