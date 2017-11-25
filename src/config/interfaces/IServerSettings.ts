/**
 * @module common/server
 */
/** */

import * as Https from "https";
import {Env} from "../../core/interfaces";

export interface IServerMountDirectories {
    [endpoint: string]: any | string | (any | string)[];
}

export interface ILoggerSettings {
    debug?: boolean;
    requestFields?: ("reqId" | "method" | "url" | "headers" | "body" | "query" | "params" | "duration")[];
    logRequest?: boolean;
    reqIdBuilder: () => number;
}

export interface IServerSettings {
    rootDir?: string;
    env?: Env;
    port?: string | number;
    httpPort?: string | number | false;
    httpsPort?: string | number | false;
    httpsOptions?: Https.ServerOptions;
    uploadDir?: string;
    mount?: IServerMountDirectories;
    componentsScan?: string[];
    serveStatic?: IServerMountDirectories;
    acceptMimes?: string[];
    debug?: boolean;
    logRequestFields?: ("reqId" | "method" | "url" | "headers" | "body" | "query" | "params" | "duration")[];
    validationModelStrict?: boolean;
    logger?: Partial<ILoggerSettings>;

    [key: string]: any;
}