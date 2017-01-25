import {ENDPOINT_VIEW, ENDPOINT_VIEW_OPTIONS} from "../constants/metadata-keys";
import Metadata from "../services/metadata";

export function ResponseView(viewPath: string, viewOptions?: Object): Function {

    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        Metadata.set(ENDPOINT_VIEW, viewPath, target, targetKey);
        Metadata.set(ENDPOINT_VIEW_OPTIONS, viewOptions, target, targetKey);

        return descriptor;
    };
}

