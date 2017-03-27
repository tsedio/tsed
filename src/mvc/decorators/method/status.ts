/**
 * @module mvc
 */
/** */
import {UseAfter} from "./useAfter";
/**
 * Sets the HTTP status for the response. It is a chainable alias of Node’s `response.statusCode`.
 *
 * ```typescript
 *  @Status(403)
 *  private myMethod() {}
 * ```
 *
 * @param code
 * @returns {Function}
 * @decorator
 */
export function Status(code: number): Function {

    return <T>(target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        return UseAfter((request, response, next) => {

            if (!response.headersSent) {
                response.status(code);
            }

            next();

        })(target, targetKey, descriptor);

    };
}
