import {Use} from "./use";

export function Location(location: string): Function {

    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        return Use((request, response, next) => {

            response.location(location);

            next();

        })(target, targetKey, descriptor);
    };
}
