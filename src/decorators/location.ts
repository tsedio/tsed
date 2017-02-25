import {UseAfter} from "./use-after";
/**
 * Sets the response Location HTTP header to the specified path parameter.
 *
 * ```typescript
 * \@Location('/foo/bar')
 * \@Location('http://example.com')
 * \@Location('back')
 * private myMethod() {
 *
 * }
 * ```
 *
 * A path value of “back” has a special meaning, it refers to the URL specified in the `Referer` header of the request. If the `Referer` header was not specified, it refers to “/”.
 *
 * @param location
 * @returns {Function}
 * @constructor
 */
export function Location(location: string): Function {

    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        return UseAfter((request, response, next) => {

            response.location(location);

            next();

        })(target, targetKey, descriptor);
    };
}
