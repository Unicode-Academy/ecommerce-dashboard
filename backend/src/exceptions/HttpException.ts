export class HttpException extends Error {
    protected status: number;
    constructor(message: string, status: number = 500) {
        super(message);
        this.status = status;
    }
}
