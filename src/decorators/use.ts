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

        let endpointArgs = Metadata.has(ENDPOINT_ARGS, target, targetKey)
            ? Metadata.get(ENDPOINT_ARGS, target, targetKey) : [];

        endpointArgs = endpointArgs.concat(args);

        Metadata.set(ENDPOINT_ARGS, endpointArgs, target, targetKey);

        return descriptor;
    };
}