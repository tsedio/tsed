"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@tsed/core");
const endpointFn_1 = require("./endpointFn");
const isSuccessStatus = (code) => code && 200 <= code && code < 300;
/**
 * Define the returned type for the serialization.
 *
 * ```typescript
 * @Controller('/')
 * export class Ctrl {
 *    @Get('/')
 *    @ReturnType(200, {type: User, collectionType: Map})
 *    get(): Promise<Map<User>> { }
 * }
 *
 * ```
 *
 * @returns {Function}
 * @param response
 * @decorator
 * @endpoint
 */
function ReturnType(response = {}) {
    return endpointFn_1.EndpointFn(endpoint => {
        const { responses, statusCode } = endpoint;
        const code = response.code || statusCode; // implicit
        if (isSuccessStatus(response.code)) {
            const { response } = endpoint;
            responses.delete(statusCode);
            endpoint.statusCode = code;
            endpoint.responses.set(code, response);
        }
        response = Object.assign({ code, description: "" }, core_1.deepMerge(endpoint.get(code), core_1.cleanObject(response)));
        endpoint.responses.set(response.code, response);
    });
}
exports.ReturnType = ReturnType;
//# sourceMappingURL=returnType.js.map