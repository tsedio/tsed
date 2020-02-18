"use strict";
var ServerSettingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@tsed/core");
const di_1 = require("@tsed/di");
const ts_log_debug_1 = require("ts-log-debug");
const rootDir = process.cwd();
/**
 * `ServerSettingsService` contains all information about [ServerLoader](/api/common/server/components/ServerLoader.md) configuration.
 */
let ServerSettingsService = ServerSettingsService_1 = class ServerSettingsService extends di_1.DIConfiguration {
    constructor() {
        super({
            rootDir,
            env: process.env.NODE_ENV || core_1.Env.DEV,
            httpPort: 8080,
            httpsPort: 8000,
            version: "1.0.0",
            uploadDir: "${rootDir}/uploads",
            scopes: {
                [di_1.ProviderType.CONTROLLER]: di_1.ProviderScope.SINGLETON
            },
            logger: {
                debug: false,
                level: "info",
                logRequest: true,
                jsonIndentation: process.env.NODE_ENV === core_1.Env.PROD ? 0 : 2
            },
            errors: {
                headerName: "errors"
            },
            mount: {
                "/rest": "${rootDir}/controllers/**/*.ts"
            },
            exclude: ["**/*.spec.ts", "**/*.spec.js"],
            componentsScan: [
                "${rootDir}/mvc/**/*.ts",
                "${rootDir}/services/**/*.ts",
                "${rootDir}/middlewares/**/*.ts",
                "${rootDir}/converters/**/*.ts"
            ]
        });
    }
    get version() {
        return this.getRaw("version");
    }
    set version(v) {
        this.setRaw("version", v);
    }
    get rootDir() {
        return this.getRaw("rootDir");
    }
    set rootDir(value) {
        this.setRaw("rootDir", value);
    }
    get port() {
        return this.httpPort;
    }
    set port(value) {
        this.httpPort = value;
    }
    get httpsOptions() {
        return this.getRaw("httpsOptions");
    }
    set httpsOptions(value) {
        this.setRaw("httpsOptions", value);
    }
    get httpPort() {
        return this.getRaw("httpPort");
    }
    set httpPort(value) {
        this.setRaw("httpPort", value);
    }
    get httpsPort() {
        return this.getRaw("httpsPort");
    }
    set httpsPort(value) {
        this.setRaw("httpsPort", value);
    }
    get uploadDir() {
        return this.get("uploadDir");
    }
    set uploadDir(value) {
        this.setRaw("uploadDir", value);
    }
    get env() {
        return this.getRaw("env");
    }
    set env(value) {
        this.setRaw("env", value);
    }
    get mount() {
        return this.get("mount");
    }
    set mount(value) {
        this.setRaw("mount", value);
    }
    get componentsScan() {
        return this.resolve(this.getRaw("componentsScan"));
    }
    set componentsScan(value) {
        this.setRaw("componentsScan", value);
    }
    get statics() {
        return this.getRaw("statics") || this.getRaw("serveStatic") || {};
    }
    set statics(value) {
        this.setRaw("statics", value);
    }
    /**
     * @deprecated
     */
    /* istanbul ignore next */
    get serveStatics() {
        return this.statics;
    }
    /**
     * @deprecated
     */
    /* istanbul ignore next */
    set serveStatics(value) {
        this.statics = value;
    }
    get acceptMimes() {
        return this.getRaw("acceptMimes") || ["application/json"];
    }
    set acceptMimes(value) {
        this.setRaw("acceptMimes", value || []);
    }
    get debug() {
        return this.logger.level === "info";
    }
    set debug(debug) {
        this.logger = Object.assign(Object.assign({}, this.logger), { level: debug ? "debug" : "info" });
    }
    get routers() {
        return this.get("routers") || {};
    }
    set routers(options) {
        this.setRaw("routers", options);
    }
    get validationModelStrict() {
        const value = this.getRaw("validationModelStrict");
        return value === undefined ? true : value;
    }
    set validationModelStrict(value) {
        this.setRaw("validationModelStrict", value);
    }
    get logger() {
        return this.get("logger");
    }
    set logger(value) {
        const logger = Object.assign(Object.assign({}, this.logger), value);
        logger.debug = logger.level === "debug";
        this.setRaw("logger", logger);
        this.setRaw("debug", logger.debug);
        if (logger.format) {
            ts_log_debug_1.$log.appenders.set("stdout", {
                type: "stdout",
                levels: ["info", "debug"],
                layout: {
                    type: "pattern",
                    pattern: logger.format
                }
            });
            ts_log_debug_1.$log.appenders.set("stderr", {
                levels: ["trace", "fatal", "error", "warn"],
                type: "stderr",
                layout: {
                    type: "pattern",
                    pattern: logger.format
                }
            });
        }
    }
    get exclude() {
        return this.get("exclude");
    }
    set exclude(exclude) {
        this.setRaw("exclude", exclude);
    }
    /**
     * @deprecated
     */
    get controllerScope() {
        return this.scopes[di_1.ProviderType.CONTROLLER];
    }
    /**
     * @deprecated
     */
    set controllerScope(scope) {
        this.scopes[di_1.ProviderType.CONTROLLER] = scope;
    }
    /**
     *
     * @returns {IRouterSettings}
     */
    get errors() {
        return this.get("errors");
    }
    /**
     *
     * @param {IRouterSettings} options
     */
    set errors(options) {
        this.setRaw("errors", options);
    }
    /**
     *
     * @param addressPort
     * @returns {{address: string, port: number}}
     */
    static buildAddressAndPort(addressPort) {
        let address = "0.0.0.0";
        let port = addressPort;
        if (typeof addressPort === "string" && addressPort.indexOf(":") > -1) {
            [address, port] = addressPort.split(":");
            port = +port;
        }
        return { address, port: port };
    }
    /**
     *
     * @returns {string|number}
     */
    getHttpPort() {
        return ServerSettingsService_1.buildAddressAndPort(this.getRaw("httpPort"));
    }
    /**
     *
     * @param settings
     */
    setHttpPort(settings) {
        this.setRaw("httpPort", `${settings.address}:${settings.port}`);
    }
    /**
     *
     * @returns {string|number}
     */
    getHttpsPort() {
        return ServerSettingsService_1.buildAddressAndPort(this.getRaw("httpsPort"));
    }
    /**
     *
     * @param settings
     */
    setHttpsPort(settings) {
        this.setRaw("httpsPort", `${settings.address}:${settings.port}`);
    }
};
ServerSettingsService = ServerSettingsService_1 = tslib_1.__decorate([
    di_1.Injectable({
        scope: di_1.ProviderScope.SINGLETON,
        global: true
    }),
    tslib_1.__metadata("design:paramtypes", [])
], ServerSettingsService);
exports.ServerSettingsService = ServerSettingsService;
//# sourceMappingURL=ServerSettingsService.js.map