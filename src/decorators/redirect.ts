import {Use} from "./use";

export function Redirect(location: string): Function {

    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        return Use((request, response, next) => {

            response.redirect(location);

            next();

        })(target, targetKey, descriptor);
    };
}
