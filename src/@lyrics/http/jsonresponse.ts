export class JsonResponse {
    private content: Object;

    constructor(content?: Object) {
        this.content = (content === null) ? {} : content;
    }

    getJsonContent() {
        return this.content
    }
}
