"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("@tsed/di");
/**
 * Inject the Https.Server instance.
 *
 * ### Example
 *
 * ```typescript
 * import {HttpsServer, Service} from "@tsed/common";
 *
 * @Service()
 * export default class OtherService {
 *    constructor(@HttpsServer httpServer: HttpServer) {}
 * }
 * ```
 *
 * > Note: TypeScript transform and store `HttpsServer` as `Function` type in the metadata. So to inject a factory, you must use the `@Inject(type)` decorator.
 *
 * @param {Type<any>} target
 * @param {string} targetKey
 * @param {TypedPropertyDescriptor<Function> | number} descriptor
 * @returns {any}
 * @decorator
 */
function HttpsServer(target, targetKey, descriptor) {
    return di_1.Inject(HttpsServer)(target, targetKey, descriptor);
}
exports.HttpsServer = HttpsServer;
//# sourceMappingURL=httpsServer.js.map