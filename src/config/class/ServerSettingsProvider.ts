import * as Https from "https";
import {Env, Metadata} from "../../core";
import {getValue} from "../../core/utils";
import {SERVER_SETTINGS} from "../constants";
import {IRouterOptions} from "../interfaces/IRouterOptions";
import {ILoggerSettings, IServerMountDirectories, IServerSettings} from "../interfaces/IServerSettings";

const rootDir = process.cwd();
let REQ_ID = 0;

export class ServerSettingsProvider implements IServerSettings {

    protected map = new Map<string, any>();

    constructor() {

        this.rootDir = rootDir;
        this.env = process.env.NODE_ENV as Env || Env.DEV;
        this.port = 8080;
        this.httpsPort = 8000;
        this.version = "1.0.0";
        this.uploadDir = "${rootDir}/uploads";
        this.debug = false;
        this.logger = {
            logRequest: true
        };

        this.mount = {
            "/rest": "${rootDir}/controllers/**/*.js"
        };

        this.componentsScan = [
            "${rootDir}/mvc/**/*.js",
            "${rootDir}/services/**/*.js",
            "${rootDir}/converters/**/*.js"
        ];

    }

    /**
     *
     * @returns {any}
     */
    get version() {
        return this.map.get("version");
    }

    set version(v: string) {
        this.map.set("version", v);
    }

    /**
     *
     * @returns {any}
     */
    get rootDir() {
        return this.map.get("rootDir");
    }

    /**
     *
     * @param value
     */
    set rootDir(value: string) {
        this.map.set("rootDir", value);
    }

    /**
     *
     * @param value
     */
    set port(value: string | number) {
        this.httpPort = value;
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
     * @param value
     */
    set httpsOptions(value: Https.ServerOptions) {
        this.map.set("httpsOptions", value);
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
     * @param value
     */
    set httpPort(value: string | number) {
        this.map.set("httpPort", value);
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
     * @param value
     */
    set httpsPort(value: string | number) {
        this.map.set("httpsPort", value);
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
     * @param value
     */
    set uploadDir(value: string) {
        this.map.set("uploadDir", value);
    }

    /**
     *
     * @returns {Map<string, any>}
     */
    get env(): Env {
        return this.map.get("env");
    }

    /**
     *
     * @param value
     */
    set env(value: Env) {
        this.map.set("env", value);
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
     * @param value
     */
    set mount(value: IServerMountDirectories) {
        this.map.set("mount", value);

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
     * @param value
     */
    set componentsScan(value: string[]) {
        this.map.set("componentsScan", value);
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
     * @param value
     */
    set serveStatic(value: IServerMountDirectories) {
        this.map.set("serveStatic", value);
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
     * @param value
     */
    set acceptMimes(value: string[]) {
        this.map.set("acceptMimes", value || []);
    }

    /**
     *
     * @returns {boolean}
     */
    get debug(): boolean {
        return !!this.map.get("debug");
    }

    /**
     *
     * @param {boolean} debug
     */
    set debug(debug: boolean) {
        this.map.set("debug", debug);
    }

    /**
     *
     * @returns {IRouterOptions}
     */
    get routers(): IRouterOptions {
        return this.map.get("routers") || {};
    }

    /**
     *
     * @param {IRouterOptions} options
     */
    set routers(options: IRouterOptions) {
        this.map.set("routers", options);
    }

    /**
     *
     * @returns {boolean}
     */
    get validationModelStrict(): boolean {
        const value = this.map.get("validationModelStrict");
        return value === undefined ? true : value;
    }

    /**
     *
     * @param {boolean} value
     */
    set validationModelStrict(value: boolean) {
        this.map.set("validationModelStrict", value);
    }

    get logger(): Partial<ILoggerSettings> {
        const debug = this.debug;
        const requestFields = this.get("logRequestFields");
        return Object.assign({
            requestFields,
            debug
        }, this.map.get("logger"));
    }

    set logger(value: Partial<ILoggerSettings>) {
        this.map.set("logger", value);
    }

    /**
     *
     * @param target
     * @returns {any}
     */
    static getMetadata(target: any) {
        return Metadata.getOwn(SERVER_SETTINGS, target);
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

    /**
     *
     * @returns {ServerSettingsService}
     */
    public $get(): ServerSettingsProvider {
        this.forEach((value, key) => {
            this.map.set(key, this.resolve(value));
        });
        return this;
    }

    /**
     *
     * @param callbackfn
     * @param thisArg
     */
    forEach(callbackfn: (value: any, index: string, map: Map<string, any>) => void, thisArg?: any) {
        return this.map.forEach(callbackfn, thisArg);
    }

    /**
     *
     * @param propertyKey
     * @param value
     */
    set(propertyKey: string | IServerSettings, value?: any): ServerSettingsProvider {

        if (typeof propertyKey === "string") {
            this.map.set(propertyKey, value);
        } else {
            const self: any = this;

            Object.keys(propertyKey as IServerSettings).forEach((key) => {

                const descriptor = Object.getOwnPropertyDescriptor(ServerSettingsProvider.prototype, key);

                if (descriptor && ["set", "map"].indexOf(key) === -1) {
                    self[key] = propertyKey[key];
                } else {
                    this.set(key, propertyKey[key]);
                }

            });

        }

        return this;
    }

    /**
     *
     * @param propertyKey
     * @returns {undefined|any}
     */
    get<T>(propertyKey: string): T {
        return getValue(propertyKey, this.map);
    }

    /**
     *
     * @param value
     * @returns {any}
     */
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

    /**
     *
     * @returns {string|number}
     */
    getHttpPort(): { address: string, port: number } {
        return ServerSettingsProvider.buildAddressAndPort(this.map.get("httpPort"));
    }

    /**
     *
     * @returns {string|number}
     */
    getHttpsPort(): { address: string, port: number } {
        return ServerSettingsProvider.buildAddressAndPort(this.map.get("httpsPort"));
    }
}