import {ENDPOINT_USE_BEFORE} from "../constants/metadata-keys";
import {Metadata} from "../services";

/**
 * Use decorator.
 * @returns {function(any, any, any): *}
 * @constructor
 * @param args
 */
export function UseBefore(...args: any[]): Function {

    return <T> (
        target: Function,
        targetKey: string,
        descriptor: TypedPropertyDescriptor<T>
    ) : TypedPropertyDescriptor<T> => {

        const middlewares = Metadata.get(ENDPOINT_USE_BEFORE, target, targetKey) || [];

        Metadata.set(ENDPOINT_USE_BEFORE, args.concat(middlewares), target, targetKey);

        return descriptor;
    };
}