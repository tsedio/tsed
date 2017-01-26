import {ENDPOINT_USE_AFTER} from "../constants/metadata-keys";
import Metadata from "../services/metadata";

/**
 * Use decorator.
 * @returns {function(any, any, any): *}
 * @constructor
 * @param args
 */
export function UseAfter(...args: any[]): Function {

    return <T> (
        target: Function,
        targetKey: string,
        descriptor: TypedPropertyDescriptor<T>
    ) : TypedPropertyDescriptor<T> => {

        const middlewares = Metadata.get(ENDPOINT_USE_AFTER, target, targetKey) || [];

        Metadata.set(ENDPOINT_USE_AFTER, args.concat(middlewares), target, targetKey);

        return descriptor;
    };
}