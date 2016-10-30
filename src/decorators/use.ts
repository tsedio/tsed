import Controller from "../controllers/controller";
import {ENDPOINT_ARGS} from '../constants/metadata-keys';
import Metadata from '../metadata/metadata';
import {Endpoint} from '../controllers/endpoint';
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

        const endpointArgs = Metadata.has(ENDPOINT_ARGS, target, targetKey)
            ? Metadata.get(ENDPOINT_ARGS, target, targetKey) : [];

        endpointArgs.concat(args);

        Metadata.set(ENDPOINT_ARGS, endpointArgs, target, targetKey);

        return descriptor;
    };
}