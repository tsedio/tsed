import {UseAfter} from "./use-after";
/**
 * Sets the HTTP status for the response. It is a chainable alias of Node’s `response.statusCode`.
 *
 * ```typescript
 * \@Status(403)
 * private myMethod() {}
 * ```
 *
 * @param code
 * @returns {Function}
 * @constructor
 */
export function Status(code: number): Function {

    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        return UseAfter((request, response, next) => {

            response.status(code);

            next();

        })(target, targetKey, descriptor);

    };
}
