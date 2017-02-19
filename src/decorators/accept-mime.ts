
import {Endpoint} from "../controllers/endpoint";
import {UseBefore} from "./use-before";
import AcceptMimeMiddleware from "../middlewares/accept-mime";

export function AcceptMime(...mimes: string[]): Function {

    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        Endpoint.setMetadata(AcceptMimeMiddleware, mimes, target, targetKey);

        return UseBefore(AcceptMimeMiddleware)(target, targetKey, descriptor);
    };
}