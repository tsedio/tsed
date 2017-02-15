import {UseAfter} from "./use-after";

export function Location(location: string): Function {

    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        return UseAfter((request, response, next) => {

            response.location(location);

            next();

        })(target, targetKey, descriptor);
    };
}
