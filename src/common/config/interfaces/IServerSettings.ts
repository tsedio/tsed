/**
 * @module common/server
 */
/** */

import {Env} from "@tsed/core";
import * as Https from "https";
import {ProviderScope} from "../../di/interfaces";

export interface IServerMountDirectories {
    [endpoint: string]: any | string | (any | string)[];
}

export interface ILoggerSettings {
    debug?: boolean;
    requestFields?: ("reqId" | "method" | "url" | "headers" | "body" | "query" | "params" | "duration")[];
    logRequest?: boolean;
    jsonIndentation?: number;
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
    exclude?: string[];
    mount?: IServerMountDirectories;
    componentsScan?: string[];
    serveStatic?: IServerMountDirectories;
    acceptMimes?: string[];
    debug?: boolean;
    logRequestFields?: ("reqId" | "method" | "url" | "headers" | "body" | "query" | "params" | "duration")[];
    validationModelStrict?: boolean;
    logger?: Partial<ILoggerSettings>;
    controllerScope?: ProviderScope;

    [key: string]: any;
}