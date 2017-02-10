import {UseAfter} from "./use-after";

export function Redirect(location: string): Function {

    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        return UseAfter((request, response, next) => {

            response.redirect(location);

            next();

        })(target, targetKey, descriptor);
    };
}
