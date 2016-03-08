import {MiddlewareFactory} from "../lib/middleware-factory.ts";
import {Forbidden} from "httpexceptions";
/**
 * Method decorator
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Authenticated<T>(targetClass: any, methodClassName: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> {

    MiddlewareFactory(targetClass, methodClassName, {
        handlers:   [{
            method:     'auth',
            callback:   function(request: any, response: any, next: Function){

                if (request.isAuthenticated()) {
                    return next();
                }

                next(new Forbidden('Forbidden'));

            }
        }]
    });

    return descriptor;
}