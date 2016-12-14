import {ENDPOINT_VIEW} from "../constants/metadata-keys";
import Metadata from "../metadata/metadata";

export function ResponseView(viewPath: string): Function {

    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        Metadata.set(ENDPOINT_VIEW, viewPath, target, targetKey);

        return descriptor;
    };
}

