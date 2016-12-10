
import {Use} from "./use";
import * as Express from "express";

export function Authenticated(authorization?): Function {
    return Use((request, response, next: Express.NextFunction): void => {
        /* istanbul ignore else */
        if (typeof request.$tryAuth === "function") {
            request.$tryAuth(request, response, next, authorization);
        }
    });
}