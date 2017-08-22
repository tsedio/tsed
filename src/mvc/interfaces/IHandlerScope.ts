/**
 * @module common/mvc
 */
/** */
import * as Express from "express";

export interface IHandlerScope {
    request: Express.Request;
    response: Express.Response;
    next: Function;
    err?: any;

    [service: string]: any;
}