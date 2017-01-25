
import * as Express from "express";
import {UseBefore} from "./use-before";

export function Authenticated(authorization?): Function {
    return UseBefore((request, response, next: Express.NextFunction): void => {
        /* istanbul ignore else */
        if (typeof request.$tryAuth === "function") {
            request.$tryAuth(request, response, next, authorization);
        }
    });
}