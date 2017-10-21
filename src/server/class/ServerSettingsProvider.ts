/**
 * @module common/server
 */
/** */
import * as Https from "https";
import {Metadata} from "../../core/class/Metadata";
import {Env, EnvTypes} from "../../core/interfaces";
import {IRouterOptions} from "../../mvc/interfaces";
import {SERVER_SETTINGS} from "../constants";

import {IServerMountDirectories, IServerSettings} from "../interfaces";
import {ServerSettingsService} from "../services/ServerSettingsService";

const rootDir = process.cwd();

export class ServerSettingsProvider implements IServerSettings {

    protected map = new Map<string, any>();

    constructor() {

        this.rootDir = rootDir;
        this.env = process.env.NODE_ENV as Env || EnvTypes.DEV as Env;
        this.port = 8080;
        this.httpsPort = 8000;
        this.endpointUrl = "/rest";
        this.version = "1.0.0";
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

    set version(v: string) {
        this.map.set("version", v);
    }

    /**
     *
     * @param value
     */
    set rootDir(value: string) {
        this.map.set("rootDir", value);
    }

    get rootDir() {
        return this.map.get("rootDir");
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
     * @param callback
     */
    set authentification(callback: (request?: any, response?: any, next?: any, options?: any) => boolean) {
        this.map.set("authentification", callback);
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

    set routers(options: IRouterOptions) {
        this.map.set("routers", options);
    }

    get validationModelStrict(): boolean {
        const value = this.map.get("validationModelStrict");
        return value === undefined ? true : value;
    }

    set validationModelStrict(value: boolean) {
        this.map.set("validationModelStrict", value);
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
        return Metadata.getOwn(SERVER_SETTINGS, target);
    }
}