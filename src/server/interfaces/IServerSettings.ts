/**
 * @module common/server
 */ /** */

import * as Https from "https";

import {Env} from "../../core/interfaces/Env";

export interface IServerMountDirectories {
    [endpoint: string]: string;
}

export interface IServerSettings {
    rootDir?: string;
    endpointUrl?: string;
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
    [key: string]: any;
}