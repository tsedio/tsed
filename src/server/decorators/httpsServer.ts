import * as Https from "https";
import {Type} from "../../core/interfaces";
import {Inject} from "../../di/decorators/inject";

export interface IHttpsFactory {
    (target: Type<any>, targetKey: string, descriptor: TypedPropertyDescriptor<Function> | number): any;

    /**
     * deprecated
     * @returns {"https".Server}
     */
    get(): Https.Server;
}

export type HttpsServer = Https.Server & IHttpsFactory;

/**
 * Inject the Https.Server instance.
 *
 * ### Example
 *
 * ```typescript
 * import {HttpsServer, Service} from "ts-express-decorators";
 *
 * @Service()
 * export default class OtherService {
 *    constructor(@HttpsServer httpServer: HttpServer) {}
 * }
 * ```
 *
 * > Note: TypeScript transform and store `ExpressApplication` as `Function` type in the metadata. So to inject a factory, you must use the `@Inject(type)` decorator.
 *
 * @param {Type<any>} target
 * @param {string} targetKey
 * @param {TypedPropertyDescriptor<Function> | number} descriptor
 * @returns {any}
 * @decorator
 */
export function HttpsServer(target: Type<any>, targetKey: string, descriptor: TypedPropertyDescriptor<Function> | number) {
    return Inject(HttpsServer)(target, targetKey, descriptor);
}
