import {Endpoint} from "./endpoint";
import * as Controllers from "./controllers";
/**
 * Method decorator
 * @param method
 * @param route
 * @returns {function(any, any, any): *}
 * @constructor
 */
export function Use(...args: any[]): Function {

    return <T> (
        targetClass: Function,
        methodClassName: string,
        descriptor: TypedPropertyDescriptor<T>
    ) : TypedPropertyDescriptor<T> => {

        Controllers.setEndpoint(targetClass, methodClassName, args);

        return descriptor;
    };
}