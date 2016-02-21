import {MiddlewareFactory} from "../lib/middleware-factory.ts";
import {Forbidden} from "httpexceptions";
/**
 * Method decorator
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Authenticated(targetClass, methodClassName, descriptor){

    MiddlewareFactory(targetClass, methodClassName, {
        handlers:   [{
            method:     'auth',
            callback:   function(request, response, next){

                if (request.isAuthenticated()) {
                    return next();
                }

                next(new Forbidden('Forbidden'));

            }
        }]
    });

    return descriptor;
}