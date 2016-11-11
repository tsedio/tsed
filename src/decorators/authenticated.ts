
import {Use} from "./use";
import * as Express from "express";

/**
 * Method decorator
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Authenticated(): Function {
    return Use((request, response, next: Express.NextFunction): void => {
        if (typeof request.$tryAuth === 'function') {
            request.$tryAuth(request, response, next);
        }
    });
}