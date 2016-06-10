import {Use} from "./use";
import {Forbidden} from "httpexceptions";

/**
 * Method decorator
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Authenticated(): Function {
    return Use(function(request: any, response: any, next: Function) {
        if (typeof request.$isAuthenticated === 'function') {
            if(request.$isAuthenticated())
            return next();
            next(new Forbidden("Forbidden"));
        }
    });
}