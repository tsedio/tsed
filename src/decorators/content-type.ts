import {UseAfter} from "./use-after";
import {Endpoint} from "../controllers/endpoint";
import {DESIGN_RETURN_CONTENT_TYPE} from "../constants/metadata-keys";
/**
 * Sets the Content-Type HTTP header to the MIME type as determined by mime.lookup() for the specified type.
 * If type contains the “/” character, then it sets the `Content-Type` to type.
 *
 * ```typescript
 * \@ContentType('.html');              // => 'text/html'
 * \@ContentType('html');               // => 'text/html'
 * \@ContentType('json');               // => 'application/json'
 * \@ContentType('application/json');   // => 'application/json'
 * \@ContentType('png');                // => image/png
 * private myMethod() {}
 * ```
 *
 * @param type
 * @returns {Function}
 * @constructor
 */
export function ContentType(type: string): Function {

    return <T>(target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        const apiInfo = Endpoint.getApiInfo(target, targetKey);

        apiInfo.produces = apiInfo.produces || [];
        apiInfo.produces.push(type);

        Endpoint.setApiInfo(apiInfo, target, targetKey);

        return UseAfter((request, response, next) => {

            /* istanbul ignore next */
            if (!response.headersSent) {
                response.type(type);
            }

            next();

        })(target, targetKey, descriptor);
    };
}
