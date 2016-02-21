
import {iMiddlewareClass} from "./models/middleware-class";
import {iMiddlewares} from "./models/middlewares";
import {MiddlewaresRegistry} from "./middlewares-registry";
/**
 * Add a middleware to stack.
 * @param targetClass
 * @param methodClassName
 * @param middlewares
 */
export function MiddlewareFactory(targetClass:iMiddlewareClass, methodClassName:string, middlewares:iMiddlewares){

    if(targetClass.middlewares == undefined){
        targetClass.middlewares = {};
    }


    if(!targetClass.middlewares[methodClassName]){
        targetClass.middlewares[methodClassName] = new MiddlewaresRegistry();
    }

    targetClass.middlewares[methodClassName].push(middlewares);
}