"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("@tsed/di");
/**
 * Inject the Http.Server instance.
 *
 * ### Example
 *
 * ```typescript
 * import {HttpServer, Service} from "@tsed/common";
 *
 * @Service()
 * export default class OtherService {
 *    constructor(@HttpServer httpServer: HttpServer) {}
 * }
 * ```
 *
 * > Note: TypeScript transform and store `HttpServer` as `Function` type in the metadata. So to inject a factory, you must use the `@Inject(type)` decorator.
 *
 * @param {Type<any>} target
 * @param {string} targetKey
 * @param {TypedPropertyDescriptor<Function> | number} descriptor
 * @returns {any}
 * @decorator
 */
function HttpServer(target, targetKey, descriptor) {
    return di_1.Inject(HttpServer)(target, targetKey, descriptor);
}
exports.HttpServer = HttpServer;
//# sourceMappingURL=httpServer.js.map