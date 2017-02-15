import {UseAfter} from "./use-after";

export function ContentType(type: string): Function {

    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        return UseAfter((request, response, next) => {

            response.set("Content-Type", type);

            next();

        })(target, targetKey, descriptor);
    };
}
