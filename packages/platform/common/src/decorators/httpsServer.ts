import {Type} from "@tsed/core";
import {Inject} from "@tsed/di";
import Https from "https";

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
 * @deprecated Use Https.Server from "https"
 */
export function HttpsServer(target: Type<any>, targetKey: string, descriptor: TypedPropertyDescriptor<Function> | number) {
  return Inject(HttpsServer)(target, targetKey, descriptor);
}

export type HttpsServer = Https.Server;
