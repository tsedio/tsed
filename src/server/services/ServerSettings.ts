/**
 * @module server
 */
/** */
import * as Path from "path";
import * as Https from "https";
import {IServerMountDirectories, IServerSettings} from "../interfaces/ServerSettings";
import {Env, EnvTypes} from "../../core/interfaces/Env";
import {SERVER_SETTINGS} from "../constants/index";
import {Metadata} from "../../core/class/Metadata";
const rootDir = Path.dirname(require.main.filename);


/**
 * `ServerSettingsService` contains all informations about ServerLoader configuration.
 */
export class ServerSettingsService implements IServerSettings {

    /***
     *
     * @type {Map<string, any>}
     */
    protected map = new Map<string, any>();

    constructor(settings?: Map<string, any>) {

        if (settings) {
            settings.forEach((value, key) => this.map.set(key, value));
        }
    }

    get rootDir() {
        return this.map.get("rootDir");
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
        return this.map.get("uploadDir").replace("${rootDir}", this.rootDir);
    }

    /**
     *
     * @returns {undefined|any}
     */
    get mount(): IServerMountDirectories {

        const obj = this.map.get("mount") || [];
        const finalObj = {};

        Object.keys(obj).forEach(k => {
            finalObj[k] = obj[k].replace("${rootDir}", this.rootDir);
        });

        return finalObj;
    }

    /**
     *
     * @returns {undefined|any}
     */
    get componentsScan(): string[] {

        const obj: string[] = this.map.get("componentsScan") || [];
        const finalObj = [];

        Object.keys(obj).forEach(k => {
            finalObj.push(obj[k].replace("${rootDir}", this.rootDir));
        });

        return finalObj;
    }

    /**
     *
     * @returns {undefined|any}
     */
    get serveStatic(): IServerMountDirectories {
        const obj = this.map.get("serveStatic") || {};
        const finalObj = {};

        Object.keys(obj).forEach(k => {
            finalObj[k] = obj[k].replace("${rootDir}", this.rootDir);
        });

        return finalObj;
    }

    /**
     *
     * @returns {undefined|any}
     */
    get acceptMimes(): string[] {
        return this.map.get("acceptMimes");
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
        }

        return {address, port: +port};
    }

}

export class ServerSettingsProvider implements IServerSettings {

    protected map = new Map<string, any>();

    constructor() {

        this.rootDir = rootDir;
        this.env = process.env.NODE_ENV || EnvTypes.DEV as Env;
        this.port = 8080;
        this.httpsPort = 8000;
        this.endpointUrl = "/rest";
        this.uploadDir = "${rootDir}/uploads";
        this.debug = false;

        /* istanbul ignore next */
        this.authentification = () => (true);

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
    set httpsOptions(value: Https.ServerOptions) {
        this.map.set("httpsOptions", value);
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
     * @param value
     */
    set httpsPort(value: string | number) {
        this.map.set("httpsPort", value);
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
     * @param value
     */
    set endpoint(value: string) {
        this.map.set("endpointUrl", value);
    }

    /**
     *
     * @param value
     */
    set endpointUrl(value: string) {
        this.map.set("endpointUrl", value);
    }

    get endpoint(): string {
        return this.map.get("endpointUrl");
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
     * @returns {Map<string, any>}
     */
    get env(): Env {
        return this.map.get("env") as Env;
    }

    /**
     *
     * @param fn
     */
    set authentification(fn: Function) {
        this.map.set("authentification", fn);
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
     * @param value
     */
    set componentsScan(value: string[]) {
        this.map.set("componentsScan", value);
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
     * @param value
     */
    set acceptMimes(value: string[]) {
        this.map.set("acceptMimes", value || []);
    }

    get debug(): boolean {
        return !!this.map.get("debug");
    }

    set debug(debug: boolean) {
        this.map.set("debug", debug);
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

            Object.keys(propertyKey as IServerSettings).forEach((key) => {

                const descriptor = Object.getOwnPropertyDescriptor(ServerSettingsProvider.prototype, key);

                if (descriptor && ["set", "map"].indexOf(key) === -1) {
                    this[key] = propertyKey[key];
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
     * @returns {any<string, any>}
     */
    get(propertyKey: string) {
        return this.map.get(propertyKey);
    }

    /**
     *
     * @returns {ServerSettingsService}
     */
    public $get = (): ServerSettingsService => {
        return new ServerSettingsService(this.map);
    };

    /**
     *
     * @param target
     * @returns {any}
     */
    static getMetadata(target: any) {
        return Metadata.get(SERVER_SETTINGS, target);
    }
}