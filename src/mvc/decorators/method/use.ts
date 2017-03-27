/**
 * @module mvc
 */
/** */
import {Type} from "../../../core/interfaces/Type";
import {EndpointRegistry} from "../../registries/EndpointRegistry";
/**
 * Mounts the specified middleware function or functions at the specified path: the middleware function is executed when
 * the base of the requested path matches `path.
 *
 * @returns {Function}
 * @param args
 * @decorator
 */
export function Use(...args: any[]): Function {

    return <T>(target: Type<any>,
               targetKey: string,
               descriptor: TypedPropertyDescriptor<T>
    ) : TypedPropertyDescriptor<T> => {

        EndpointRegistry.use(target, targetKey, args);

        return descriptor;
    };
}