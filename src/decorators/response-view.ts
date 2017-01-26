import {RESPONSE_VIEW, RESPONSE_VIEW_OPTIONS} from "../constants/metadata-keys";
import Metadata from "../services/metadata";
import {UseAfter} from "./use-after";
import ResponseViewMiddleware from "../middlewares/response-view";

export function ResponseView(viewPath: string, viewOptions?: Object): Function {

    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        Metadata.set(RESPONSE_VIEW, viewPath, target, targetKey);
        Metadata.set(RESPONSE_VIEW_OPTIONS, viewOptions, target, targetKey);
        
        return UseAfter(ResponseViewMiddleware)(target, targetKey, descriptor);
    };
}

