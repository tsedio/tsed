import {Store} from "../../../core/class/Store";
import {IResponseHeader} from "../../interfaces/IResponseHeader";
import {IHeadersOptions, IResponseHeaders} from "../../interfaces/IResponseHeaders";
import {mapHeaders} from "../../utils/mapHeaders";
import {UseAfter} from "./useAfter";

/**
 * Sets the response’s HTTP header field to value. To set multiple fields at once, pass an object as the parameter.
 *
 * ```typescript
 * @Header('Content-Type', 'text/plain');
 * private myMethod() {}
 *
 * @Status(204)
 * @Header({
 *   "Content-Type": "text/plain",
 *   "Content-Length": 123,
 *   "ETag": {
 *     "value": "12345",
 *     "description": "header description"
 *   }
 * })
 * private myMethod() {}
 * ```
 *
 * This example will produce the swagger responses object:
 *
 * ```json
 * {
 *   "responses": {
 *     "204": {
 *       "description": "Description",
 *       "headers": {
 *          "Content-Type": {
 *             "type": "string"
 *          },
 *          "Content-Length": {
 *             "type": "number"
 *          },
 *          "ETag": {
 *             "type": "string",
 *             "description": "header description"
 *          }
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param headerName
 * @param headerValue
 * @returns {Function}
 * @decorator
 */
export function Header(headerName: string | number | IHeadersOptions, headerValue?: string | number | IResponseHeader) {

    return <T>(target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): void => {
        if (headerValue !== undefined) {
            headerName = {[headerName as string]: headerValue};
        }

        // metadata
        const store = Store.from(target, propertyKey, descriptor);
        const headers: IResponseHeaders = mapHeaders(headerName as IHeadersOptions);

        store.merge("response", {headers});

        return UseAfter((request: any, response: any, next: any) => {
            Object.keys(headers).forEach((key) => {
                response.set(key, headers[key].value);
            });
            next();

        })(target, propertyKey, descriptor);
    };
}
