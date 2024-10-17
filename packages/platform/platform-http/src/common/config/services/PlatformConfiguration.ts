import {getHostInfoFromPort, isBoolean} from "@tsed/core";
import {DIConfiguration, Injectable, ProviderScope, TokenProvider} from "@tsed/di";
import {JsonMapperSettings} from "@tsed/json-mapper";
import Https from "https";

import {PlatformJsonMapperSettings} from "../interfaces/PlatformJsonMapperSettings.js";

const rootDir = process.cwd();

/**
 * `PlatformConfiguration` contains all information about your Server configuration.
 */
@Injectable({
  scope: ProviderScope.SINGLETON,
  global: true
})
export class PlatformConfiguration extends DIConfiguration {
  constructor() {
    super({rootDir});
  }

  get port(): string | number | false {
    return this.httpPort;
  }

  set port(value: string | number | false) {
    this.httpPort = value;
  }

  get httpsOptions(): Https.ServerOptions {
    return this.getRaw("httpsOptions");
  }

  set httpsOptions(value: Https.ServerOptions) {
    this.setRaw("httpsOptions", value);
  }

  get httpPort(): string | number | false {
    return this.getRaw("httpPort");
  }

  set httpPort(value: string | number | false) {
    this.setRaw("httpPort", value);
  }

  get httpsPort(): string | number | false {
    return this.getRaw("httpsPort");
  }

  set httpsPort(value: string | number | false) {
    this.setRaw("httpsPort", value);
  }

  get mount(): Record<string, TokenProvider[]> {
    return this.get("mount");
  }

  set mount(value: Record<string, TokenProvider[]>) {
    this.setRaw("mount", value);
  }

  get statics(): Record<string, (any | string)[]> {
    return this.getRaw("statics") || this.getRaw("serveStatic") || {};
  }

  set statics(value: Record<string, (any | string)[]>) {
    this.setRaw("statics", value);
  }

  get acceptMimes(): string[] {
    return this.getRaw("acceptMimes");
  }

  set acceptMimes(value: string[]) {
    this.setRaw("acceptMimes", value || []);
  }

  get jsonMapper(): Partial<PlatformJsonMapperSettings> {
    return {
      ...JsonMapperSettings
    };
  }

  set jsonMapper(options: Partial<PlatformJsonMapperSettings>) {
    JsonMapperSettings.strictGroups = Boolean(options.strictGroups);
    JsonMapperSettings.disableUnsecureConstructor = Boolean(options.disableUnsecureConstructor);
    JsonMapperSettings.additionalProperties = Boolean(
      isBoolean(options.additionalProperties) ? options.additionalProperties : options.additionalProperties === "accept"
    );
  }

  get additionalProperties() {
    return this.get("converter.additionalProperties") === "accept";
  }

  /**
   *
   * @returns {string|number}
   */
  getHttpPort(): ReturnType<typeof getHostInfoFromPort> {
    return getHostInfoFromPort("http", this.getRaw("httpPort"));
  }

  /**
   *
   * @param settings
   */
  setHttpPort(settings: {address: string; port: number}) {
    this.setRaw("httpPort", `${settings.address}:${settings.port}`);
  }

  /**
   *
   * @returns {string|number}
   */
  getHttpsPort() {
    return getHostInfoFromPort("https", this.getRaw("httpsPort"));
  }

  /**
   *
   * @param settings
   */
  setHttpsPort(settings: {address: string; port: number}) {
    this.setRaw("httpsPort", `${settings.address}:${settings.port}`);
  }

  getBestHost() {
    const {httpsPort, httpPort} = this;

    if (httpsPort) {
      return this.getHttpsPort();
    }

    if (httpPort) {
      return this.getHttpPort();
    }

    return {
      toString() {
        return "/";
      }
    };
  }
}

declare global {
  namespace TsED {
    // @ts-ignore
    interface Context {}

    /**
     * Here to allow extension on DIConfiguration base service
     */
    interface DIConfiguration extends PlatformConfiguration {}
  }
}
