import {UseBefore} from "./use-before";

export function ContentType(type: string): Function {

    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        return UseBefore((request, response, next) => {

            response.set("Content-Type", type);

            next();

        })(target, targetKey, descriptor);
    };
}
