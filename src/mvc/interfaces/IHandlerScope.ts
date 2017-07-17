/**
 * @module common/mvc
 */
/** */

export interface IHandlerScope {
    request: Express.Request;
    response: Express.Response;
    next: Function;
    err?: any;
    [service: string]: any;
}