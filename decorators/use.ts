import {PromisifyFactory} from "./../lib/promisify-factory.ts";
import {MiddlewareFactory} from "./../lib/middleware-factory.ts";
/**
 * Method decorator
 * @param method
 * @param path
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Use(method, path?){

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
            path:       path,
            handlers:   handlers
        });

        return descriptor;
    }
}