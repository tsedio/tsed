import {EndpointHandler} from "./endpoint-handler";
import * as Endpoints from "./endpoints";
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
        methodClassName: string | symbol,
        descriptor: TypedPropertyDescriptor<T>
    ) : TypedPropertyDescriptor<T> => {

        Endpoints.setHandler(targetClass, methodClassName, args);

        return descriptor;
    };
}