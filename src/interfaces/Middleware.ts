
import * as Express from "express";

export interface IMiddleware {
    use?(request: Express.Request, response: Express.Response, next?: Express.NextFunction): Promise<any> | void;
}

export interface IMiddlewareError {
    use?(error: any, request: Express.Request, response: Express.Response, next?: Express.NextFunction): any;
}

export interface IMiddlewareSettings<T extends IMiddleware> {
    instance?: T;
    type: string;
}