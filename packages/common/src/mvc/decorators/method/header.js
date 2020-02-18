"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const endpointFn_1 = require("./endpointFn");
function mapHeaders(headers) {
    return Object.keys(headers).reduce((newHeaders, key, index, array) => {
        const value = headers[key];
        let type = typeof value;
        let options = {
            value
        };
        if (type === "object") {
            options = value;
            type = typeof options.value;
        }
        options.type = options.type || type;
        newHeaders[key] = options;
        return newHeaders;
    }, {});
}
exports.mapHeaders = mapHeaders;
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
 * @endpoint
 */
function Header(headerName, headerValue) {
    if (headerValue !== undefined) {
        headerName = { [headerName]: headerValue };
    }
    const headers = mapHeaders(headerName);
    return endpointFn_1.EndpointFn(endpoint => {
        const { response } = endpoint;
        response.headers = core_1.deepMerge(response.headers || {}, headers);
    });
}
exports.Header = Header;
//# sourceMappingURL=header.js.map