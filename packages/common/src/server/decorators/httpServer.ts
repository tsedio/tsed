import {Type} from "@tsed/core";
import {Inject} from "@tsed/di";
import * as Http from "http";

export interface IHttpFactory {
  (target: Type<any>, targetKey: string, descriptor: TypedPropertyDescriptor<Function> | number): any;

  /**
   * @deprecated
   * @returns {"https".Server}
   */
  get(): Http.Server;
}

export type HttpServer = Http.Server & IHttpFactory;

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
export function HttpServer(target: Type<any>, targetKey: string, descriptor: TypedPropertyDescriptor<Function> | number) {
  return Inject(HttpServer)(target, targetKey, descriptor);
}
