import {Env, getHostInfoFromPort} from "@tsed/core";
import {DIConfiguration, Injectable, ProviderScope, TokenProvider} from "@tsed/di";
import Https from "https";
import {ConverterSettings} from "../interfaces/ConverterSettings";

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

  /**
   * @deprecated
   */
  get componentsScan(): string[] {
    return this.getRaw("componentsScan");
  }

  /**
   * @deprecated
   */
  set componentsScan(value: string[]) {
    this.setRaw("componentsScan", value);
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

  get converter(): Partial<ConverterSettings> {
    return this.get("converter") || {};
  }

  set converter(options: Partial<ConverterSettings>) {
    this.setRaw("converter", options);
  }

  get exclude() {
    return this.get("exclude");
  }

  set exclude(exclude: string[]) {
    this.setRaw("exclude", exclude);
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
