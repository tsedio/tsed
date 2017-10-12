/**
 * @module common/server
 */
/** */
import * as Https from "https";
import {Env} from "../../core/interfaces";
import {IRouterOptions} from "../../mvc/interfaces";
import {IServerMountDirectories, IServerSettings} from "../interfaces";

/**
 * `ServerSettingsService` contains all information about [ServerLoader](api/common/server/serverloader.md) configuration.
 */
export class ServerSettingsService implements IServerSettings {

    /**
     *
     * @type {Map<string, any>}
     */
    protected map = new Map<string, any>();

    constructor(settings?: Map<string, any>) {

        if (settings) {
            this.map.set("rootDir", settings.get("rootDir"));

            settings.forEach((value, key) => {
                this.map.set(key, this.resolve(value));
            });
        }
    }

    resolve(value: any) {
        if (typeof value === "object") {
            Object.keys(value).forEach((k: string, i: number, m: any) => {
                value[k] = this.resolve(value[k]);
            });

            return value;
        }

        if (typeof value === "string") {
            return value.replace(/\${rootDir}/, this.rootDir);
        }
        return value;
    }

    get rootDir() {
        return this.map.get("rootDir");
    }

    get version() {
        return this.map.get("version");
    }

    /**
     *
     * @returns {string}
     */
    get endpoint(): string {
        return this.map.get("endpointUrl") as string;
    }

    /**
     *
     * @returns {string}
     */
    get endpointUrl(): string {
        return this.map.get("endpointUrl") as string;
    }

    /**
     *
     * @returns {Env}
     */
    get env(): Env {
        return this.map.get("env") as Env;
    }

    /**
     *
     * @param value
     */
    get httpsOptions(): Https.ServerOptions {
        return this.map.get("httpsOptions");
    }

    /**
     *
     * @returns {undefined|any}
     */
    get httpPort(): string | number {
        return this.map.get("httpPort");
    }

    /**
     *
     * @returns {undefined|any}
     */
    get httpsPort(): string | number {
        return this.map.get("httpsPort");
    }

    /**
     *
     * @returns {string|number}
     */
    getHttpPort(): { address: string, port: number } {
        return ServerSettingsService.buildAddressAndPort(this.map.get("httpPort"));
    }

    /**
     *
     * @returns {string|number}
     */
    getHttpsPort(): { address: string, port: number } {
        return ServerSettingsService.buildAddressAndPort(this.map.get("httpsPort"));
    }

    /**
     *
     * @returns {string}
     */
    get uploadDir(): string {
        return this.map.get("uploadDir");
    }

    /**
     *
     * @returns {undefined|any}
     */
    get mount(): IServerMountDirectories {
        return this.map.get("mount") || {};
    }

    /**
     *
     * @returns {undefined|any}
     */
    get componentsScan(): string[] {
        return this.map.get("componentsScan") || [];
    }

    /**
     *
     * @returns {undefined|any}
     */
    get serveStatic(): IServerMountDirectories {
        return this.map.get("serveStatic") || {};
    }

    /**
     *
     * @returns {undefined|any}
     */
    get acceptMimes(): string[] {
        return this.map.get("acceptMimes") || ["application/json"];
    }

    /**
     *
     * @param propertyKey
     * @returns {undefined|any}
     */
    get<T>(propertyKey: string): T {
        return this.map.get(propertyKey) as T;
    }

    /**
     *
     * @returns {Function}
     */
    get authentification(): Function {
        return this.map.get("authentification") as Function;
    }

    get debug(): boolean {
        return !!this.map.get("debug");
    }

    get routers(): IRouterOptions {
        return this.map.get("routers") || {};
    }

    /**
     *
     * @param callbackfn
     * @param thisArg
     */
    forEach(callbackfn: (value: any, index: string, map: Map<string, any>) => void, thisArg?: any) {
        return this.map.forEach(callbackfn);
    }

    /**
     *
     * @param addressPort
     * @returns {{address: string, port: number}}
     */
    private static buildAddressAndPort(addressPort: string | number): { address: string, port: number } {
        let address = "0.0.0.0";
        let port = addressPort;

        if (typeof addressPort === "string" && addressPort.indexOf(":") > -1) {
            [address, port] = addressPort.split(":");
            port = +port;
        }

        return {address, port: port as number};
    }

}
