
import * as Express from "express";

export interface IMiddleware {
    use?: Function;
    // use?(request: Express.Request, response: Express.Response, next?: Express.NextFunction): Promise<any> | void;
}

export interface IMiddlewareError {
    use?: Function;
    // use?(): any;
    // use?(error: any, request: Express.Request, response: Express.Response, next?: Express.NextFunction): any;
}

export enum MiddlewareType {
    ERROR,
    MIDDLEWARE,
    ENDPOINT
}

export interface IInjectableMethod {
    target: any;
    method: string;
    length: number;
    type: MiddlewareType;
    handler: () => Function;
    injectable: boolean;
    hasNextFn: boolean;
}


export interface IMiddlewareSettings<T extends IMiddleware> {
    instance?: T;
    type: MiddlewareType;
}