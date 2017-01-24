
import {Express} from "@types/express";

export interface IMiddleware {
    use?(request: Express.Request, response: Express.Response, next?: (err?: any) => any): Promise<any> | void;
}

export interface IMiddlewareError {
    use?(error: any, request: Express.Request, response: Express.Response, next?: (err?: any) => any): any;
}

export interface IMiddlewareSettings<T extends IMiddleware> {
    instance?: T;
    type: string;
}