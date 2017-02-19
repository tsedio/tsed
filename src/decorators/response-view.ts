import {UseAfter} from "./use-after";
import ResponseViewMiddleware from "../middlewares/response-view";
import {Endpoint} from "../controllers/endpoint";

export function ResponseView(viewPath: string, viewOptions?: Object): Function {

    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        Endpoint.setMetadata(ResponseViewMiddleware, {viewPath, viewOptions}, target, targetKey);

        return UseAfter(ResponseViewMiddleware)(target, targetKey, descriptor);
    };
}

export function Render(viewPath: string, viewOptions?: Object): Function {
    return ResponseView(viewPath, viewOptions);
}