/**
 * @module common/core
 */
/** */
import * as Https from "https";
export interface HttpsServer {
    get(): Https.Server;
}
export const HttpsServer = Symbol("HttpServer");