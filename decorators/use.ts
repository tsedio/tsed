import {PromisifyFactory} from "./../lib/promisify-factory.ts";
import {MiddlewareFactory} from "./../lib/middleware-factory.ts";
import {iHandlerMiddleware} from "../lib/models/handler-middleware";
/**
 * Method decorator
 * @param method
 * @param route
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Use(method: string | Function, route?: string): Function {

    return <T> (
        targetClass: any,
        methodClassName: string | symbol,
        descriptor: TypedPropertyDescriptor<T>
    ) : TypedPropertyDescriptor<T> => {

        var originalMethod = descriptor.value;

        var handlers:iHandlerMiddleware[] = [{
            method:     typeof method == 'string' ? <string>method : null,
            callback:   <Function> PromisifyFactory(targetClass, originalMethod)
        }];

        if(typeof method == 'function'){
            handlers.unshift({
                method:     'use',
                callback:   targetClass[<string>method] ? (<Function>method).bind(targetClass) : method
            });
        }

        MiddlewareFactory(targetClass, methodClassName, {
            path:       route,
            handlers:   handlers
        });

        return descriptor;
    }
}