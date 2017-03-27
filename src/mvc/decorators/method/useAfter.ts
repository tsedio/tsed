/**
 * @module mvc
 */ /** */

import {Type} from "../../../core/interfaces/Type";
import {EndpointRegistry} from "../../registries/EndpointRegistry";
/**
 * Use decorators.
 * @returns {function(any, any, any): *}
 * @param args
 * @decorator
 */
export function UseAfter(...args: any[]): Function {

    return <T>(target: Type<any>,
               targetKey: string,
               descriptor: TypedPropertyDescriptor<T>
    ) : TypedPropertyDescriptor<T> => {

        EndpointRegistry.useAfter(target, targetKey, args);

        return descriptor;
    };
}