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
export function UseBefore(...args: any[]): Function {

    return <T>(target: Type<any>,
               targetKey: string,
               descriptor: TypedPropertyDescriptor<T>
    ) : TypedPropertyDescriptor<T> => {

        EndpointRegistry.useBefore(target, targetKey, args);

        return descriptor;
    };
}