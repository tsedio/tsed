import {ENDPOINT_ARGS} from "../constants/metadata-keys";
import {Metadata} from "../services";
/**
 * Use decorator.
 * @returns {function(any, any, any): *}
 * @constructor
 * @param args
 */
export function Use(...args: any[]): Function {

    return <T> (
        target: Function,
        targetKey: string,
        descriptor: TypedPropertyDescriptor<T>
    ) : TypedPropertyDescriptor<T> => {

        const middlewares = Metadata.get(ENDPOINT_ARGS, target, targetKey) || [];

        Metadata.set(ENDPOINT_ARGS, args.concat(middlewares), target, targetKey);

        return descriptor;
    };
}