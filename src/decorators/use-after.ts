import {ENDPOINT_USE_AFTER} from "../constants/metadata-keys";
import Metadata from "../metadata/metadata";

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

        let middlewares = Metadata.has(ENDPOINT_USE_AFTER, target, targetKey)
            ? Metadata.get(ENDPOINT_USE_AFTER, target, targetKey) : [];

        Metadata.set(ENDPOINT_USE_AFTER, middlewares.concat(args), target, targetKey);

        return descriptor;
    };
}