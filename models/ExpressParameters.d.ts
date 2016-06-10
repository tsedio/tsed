
declare interface IExpressParameters {
    request: Express.Request;
    response: Express.Response;
    next: Function;
}