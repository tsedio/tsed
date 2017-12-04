import * as Express from "express";
import {ParamMetadata} from "../class/ParamMetadata";

export interface IFilterScope {
    request: Express.Request;
    response: Express.Response;
    next: Express.NextFunction;
    err?: any;
}