export interface IHandlerScope {
    request: Express.Request;
    response: Express.Response;
    next: Express.NextFunction;
    err?: any;

    [service: string]: any;
}