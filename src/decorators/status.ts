import {UseAfter} from "./use-after";

export function Status(code: number): Function {

    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        return UseAfter((request, response, next) => {

            response.status(code);

            next();

        })(target, targetKey, descriptor);

    };
}
