import {Env} from "@tsed/core";
import {DIConfiguration, Injectable, ProviderScope, ProviderType} from "@tsed/di";
import * as Https from "https";
import {$log} from "ts-log-debug";
import {IErrorsSettings, ILoggerSettings, IRouterSettings, IServerMountDirectories} from "../interfaces";

const rootDir = process.cwd();

/**
 * `ServerSettingsService` contains all information about [ServerLoader](/api/common/server/components/ServerLoader.md) configuration.
 */
@Injectable({
  scope: ProviderScope.SINGLETON,
  global: true
})
export class ServerSettingsService extends DIConfiguration {
  constructor() {
    super({
      rootDir,
      env: (process.env.NODE_ENV as Env) || Env.DEV,
      httpPort: 8080,
      httpsPort: 8000,
      version: "1.0.0",
      uploadDir: "${rootDir}/uploads",
      scopes: {
        [ProviderType.CONTROLLER]: ProviderScope.SINGLETON
      },
      logger: {
        debug: false,
        level: "info",
        logRequest: true,
        jsonIndentation: process.env.NODE_ENV === Env.PROD ? 0 : 2
      },
      errors: {
        headerName: "errors"
      },
      mount: {
        "/rest": "${rootDir}/controllers/**/*.ts"
      },
      exclude: ["**/*.spec.ts", "**/*.spec.js"],
      componentsScan: ["${rootDir}/mvc/**/*.ts", "${rootDir}/services/**/*.ts", "${rootDir}/converters/**/*.ts"]
    });
  }

  get version() {
    return this.map.get("version");
  }

  set version(v: string) {
    this.map.set("version", v);
  }

  get rootDir() {
    return this.map.get("rootDir");
  }

  set rootDir(value: string) {
    this.map.set("rootDir", value);
  }

  get port(): string | number {
    return this.httpPort;
  }

  set port(value: string | number) {
    this.httpPort = value;
  }

  get httpsOptions(): Https.ServerOptions {
    return this.map.get("httpsOptions");
  }

  set httpsOptions(value: Https.ServerOptions) {
    this.map.set("httpsOptions", value);
  }

  get httpPort(): string | number {
    return this.map.get("httpPort");
  }

  set httpPort(value: string | number) {
    this.map.set("httpPort", value);
  }

  get httpsPort(): string | number {
    return this.map.get("httpsPort");
  }

  set httpsPort(value: string | number) {
    this.map.set("httpsPort", value);
  }

  get uploadDir(): string {
    return this.get("uploadDir");
  }

  set uploadDir(value: string) {
    this.map.set("uploadDir", value);
  }

  get env(): Env {
    return this.map.get("env");
  }

  set env(value: Env) {
    this.map.set("env", value);
  }

  get mount(): IServerMountDirectories {
    return this.get("mount");
  }

  set mount(value: IServerMountDirectories) {
    this.map.set("mount", value);
  }

  get componentsScan(): string[] {
    return this.resolve(this.map.get("componentsScan"));
  }

  set componentsScan(value: string[]) {
    this.map.set("componentsScan", value);
  }

  get statics(): IServerMountDirectories {
    return this.map.get("statics") || this.map.get("serveStatic") || {};
  }

  set statics(value: IServerMountDirectories) {
    this.map.set("statics", value);
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
  set serveStatics(value: IServerMountDirectories) {
    this.statics = value;
  }

  get acceptMimes(): string[] {
    return this.map.get("acceptMimes") || ["application/json"];
  }

  set acceptMimes(value: string[]) {
    this.map.set("acceptMimes", value || []);
  }

  get debug(): boolean {
    return this.logger.level === "info";
  }

  set debug(debug: boolean) {
    this.logger = {...this.logger, level: debug ? "debug" : "info"};
  }

  get routers(): IRouterSettings {
    return this.get("routers") || {};
  }

  set routers(options: IRouterSettings) {
    this.map.set("routers", options);
  }

  get validationModelStrict(): boolean {
    const value = this.map.get("validationModelStrict");

    return value === undefined ? true : value;
  }

  set validationModelStrict(value: boolean) {
    this.map.set("validationModelStrict", value);
  }

  get logger(): Partial<ILoggerSettings> {
    return this.get("logger");
  }

  set logger(value: Partial<ILoggerSettings>) {
    const logger = {...this.logger, ...value};
    logger.debug = logger.level === "debug";

    this.map.set("logger", logger);
    this.map.set("debug", logger.debug);

    if (logger.format) {
      $log.appenders.set("stdout", {
        type: "stdout",
        levels: ["info", "debug"],
        layout: {
          type: "pattern",
          pattern: logger.format
        }
      });

      $log.appenders.set("stderr", {
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

  set exclude(exclude: string[]) {
    this.map.set("exclude", exclude);
  }

  /**
   * @deprecated
   */
  get controllerScope(): ProviderScope {
    return this.scopes[ProviderType.CONTROLLER];
  }

  /**
   * @deprecated
   */
  set controllerScope(scope: ProviderScope) {
    this.scopes[ProviderType.CONTROLLER] = scope;
  }

  /**
   *
   * @returns {IRouterSettings}
   */
  get errors(): IErrorsSettings {
    return this.get("errors");
  }

  /**
   *
   * @param {IRouterSettings} options
   */
  set errors(options: IErrorsSettings) {
    this.map.set("errors", options);
  }

  /**
   *
   * @param addressPort
   * @returns {{address: string, port: number}}
   */
  private static buildAddressAndPort(addressPort: string | number): {address: string; port: number} {
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
   * @returns {string|number}
   */
  getHttpPort(): {address: string; port: number} {
    return ServerSettingsService.buildAddressAndPort(this.map.get("httpPort"));
  }

  /**
   *
   * @param settings
   */
  setHttpPort(settings: {address: string; port: number}) {
    this.map.set("httpPort", `${settings.address}:${settings.port}`);
  }

  /**
   *
   * @returns {string|number}
   */
  getHttpsPort(): {address: string; port: number} {
    return ServerSettingsService.buildAddressAndPort(this.map.get("httpsPort"));
  }

  /**
   *
   * @param settings
   */
  setHttpsPort(settings: {address: string; port: number}) {
    this.map.set("httpsPort", `${settings.address}:${settings.port}`);
  }
}
