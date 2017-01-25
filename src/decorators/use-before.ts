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

        let middlewares = Metadata.has(ENDPOINT_USE_BEFORE, target, targetKey)
            ? Metadata.get(ENDPOINT_USE_BEFORE, target, targetKey) : [];

        Metadata.set(ENDPOINT_USE_BEFORE, middlewares.concat(args), target, targetKey);

        return descriptor;
    };
}