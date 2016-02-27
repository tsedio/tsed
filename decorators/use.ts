import {PromisifyFactory} from "./../lib/promisify-factory.ts";
import {MiddlewareFactory} from "./../lib/middleware-factory.ts";
/**
 * Method decorator
 * @param method
 * @param route
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Use(method, route?){

    return function (targetClass, methodClassName, descriptor){
        var originalMethod = descriptor.value;

        var handlers = [{
            method:     typeof method == 'string' ? method : null,
            callback:   PromisifyFactory(targetClass, originalMethod)
        }];

        if(typeof method == 'function'){
            handlers.unshift({
                method:     'use',
                callback:   targetClass[method] ? method.bind(targetClass) : method
            });
        }

        MiddlewareFactory(targetClass, methodClassName, {
            path:       route,
            handlers:   handlers
        });

        return descriptor;
    }
}