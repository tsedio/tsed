/**
 * @module common/core
 */
/** */
import * as Http from "http";

export interface HttpServer {
    get(): Http.Server;
}
export const HttpServer = Symbol("HttpServer");

