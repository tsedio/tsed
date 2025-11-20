import {Env} from "@tsed/core/types/Env.js";
import {getValue} from "@tsed/core/utils/getValue.js";
import {isFunction} from "@tsed/core/utils/isFunction.js";
import {setValue} from "@tsed/core/utils/setValue.js";
import {$alter} from "@tsed/hooks";

import type {DILoggerOptions} from "../interfaces/DILoggerOptions.js";
import type {ImportTokenProviderOpts} from "../interfaces/ImportTokenProviderOpts.js";
import type {TokenProvider} from "../interfaces/TokenProvider.js";
import type {TokenRoute} from "../interfaces/TokenRoute.js";

/**
 * Configuration management service for the DI system.
 *
 * Stores and manages application configuration settings including imports, routes, logger options,
 * and custom properties. Provides type-safe accessors for common configuration keys and supports
 * nested property access via `get()` and `set()`.
 *
 * ### Usage
 *
 * ```typescript
 * import {DIConfiguration} from "@tsed/di";
 *
 * const config = new DIConfiguration({
 *   rootDir: __dirname,
 *   env: Env.PROD,
 *   logger: {level: "info"}
 * });
 *
 * config.set("custom.nested.key", "value");
 * const value = config.get("custom.nested.key");
 * ```
 *
 * @public
 */
export class DIConfiguration {
  readonly default: Map<string, any> = new Map();
  protected map: Map<string, any> = new Map();

  constructor(initialProps = {}) {
    Object.entries({
      imports: [],
      routes: [],
      mount: {},
      logger: {},
      ...initialProps
    }).forEach(([key, value]) => {
      this.default.set(key, value);
    });
  }

  get version() {
    return this.get("version")!;
  }

  set version(v: string) {
    this.map.set("version", v);
  }

  get rootDir() {
    return this.get("rootDir")!;
  }

  set rootDir(value: string) {
    this.map.set("rootDir", value);
  }

  get env(): Env {
    return this.map.get("env");
  }

  set env(value: Env) {
    this.map.set("env", value);
  }

  get imports(): (TokenProvider | ImportTokenProviderOpts)[] {
    return this.get("imports")!;
  }

  set imports(imports: (TokenProvider | ImportTokenProviderOpts)[]) {
    this.map.set("imports", imports);
  }

  get routes(): TokenRoute[] {
    return this.get("routes")!;
  }

  set routes(routes: TokenRoute[]) {
    this.map.set("routes", routes);
  }

  get logger(): Partial<DILoggerOptions> {
    return this.get("logger")!;
  }

  set logger(value: Partial<DILoggerOptions>) {
    const logger = {...this.logger, ...value};
    this.map.set("logger", logger);
  }

  get debug(): boolean {
    return this.logger.level === "debug";
  }

  set debug(debug: boolean) {
    this.logger = {...this.logger, level: debug ? "debug" : "info"};
  }

  get mount(): Record<string, TokenProvider[]> {
    return this.get("mount");
  }

  set mount(value: Record<string, TokenProvider[]>) {
    this.setRaw("mount", value);
  }

  /**
   *
   * @param callbackfn
   * @param thisArg
   */
  forEach(callbackfn: (value: any, index: string, map: Map<string, any>) => void, thisArg?: any) {
    return new Set([...Array.from(this.default.keys()), ...Array.from(this.map.keys())]).forEach((key) => {
      callbackfn(this.getRaw(key), key, this.map);
    }, thisArg);
  }

  set(obj: Partial<TsED.Configuration>): this;
  set(propertyKey: string, value?: unknown): this;
  set(propertyKey: string | Partial<TsED.Configuration>, value?: unknown): this {
    if (typeof propertyKey === "string") {
      value = $alter(`$alterConfig:${propertyKey}`, value);

      if (Reflect.has(this, propertyKey)) {
        // @ts-ignore
        this[propertyKey] = value;
      } else {
        this.setRaw(propertyKey, value);
      }
    } else {
      Object.entries(propertyKey).forEach(([key, value]) => {
        this.set(key, value);
      });
    }

    return this;
  }

  setRaw(propertyKey: string, value: any) {
    setValue(this.map, propertyKey, value);

    return this;
  }

  /**
   *
   * @param propertyKey
   * @param defaultValue
   * @returns {undefined|any}
   */
  get<T = any>(propertyKey: string, defaultValue?: T): T {
    return this.getRaw(propertyKey, defaultValue);
  }

  decorate(key: string, value: ((...args: unknown[]) => unknown) | PropertyDescriptor) {
    if (key in this) {
      return this;
    }
    Object.defineProperty(
      DIConfiguration.prototype,
      key,
      isFunction(value)
        ? {
            value
          }
        : value
    );
  }

  protected getRaw(propertyKey: string, defaultValue?: any): any {
    const value = getValue(this.map, propertyKey);

    if (value !== undefined) {
      return value;
    }

    return getValue(this.default, propertyKey, defaultValue);
  }
}
