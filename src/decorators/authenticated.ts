
import {UseBefore} from "./use-before";
import {Endpoint} from "../controllers/endpoint";
import AuthenticatedMiddleware from "../middlewares/authenticated";

export function Authenticated(options?: any): Function {


    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        Endpoint.setMetadata(AuthenticatedMiddleware, options, target, targetKey);

        return UseBefore(AuthenticatedMiddleware)(target, targetKey, descriptor);
    };

}