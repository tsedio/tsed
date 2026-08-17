import {$alter} from "@tsed/hooks";
import type {DILoggerOptions} from "../interfaces/DILoggerOptions.js";
import {Env} from "@tsed/core/types/Env.js";
import type {ImportTokenProviderOpts} from "../interfaces/ImportTokenProviderOpts.js";
import type {TokenProvider} from "../interfaces/TokenProvider.js";
import type {TokenRoute} from "../interfaces/TokenRoute.js";
import {getValue} from "@tsed/core/utils/getValue.js";
import {isFunction} from "@tsed/core/utils/isFunction.js";
import {setValue} from "@tsed/core/utils/setValue.js";

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

  /**
   * Creates a configuration service with the built-in defaults merged with the supplied initial properties.
   *
   * @param initialProps Initial configuration values that override built-in defaults.
   */
  constructor(initialProps = {}) {
    Object.entries({
      imports: [],
      lazyProviders: false,
      routes: [],
      mount: {},
      logger: {},
      ...initialProps
    }).forEach(([key, value]) => {
      this.default.set(key, value);
    });
  }

  /**
   * Gets the application version.
   */
  get version() {
    return this.get("version")!;
  }

  /**
   * Sets the application version.
   *
   * @param v Version to store in the configuration.
   */
  set version(v: string) {
    this.map.set("version", v);
  }

  /**
   * Gets the application's root directory.
   */
  get rootDir() {
    return this.get("rootDir")!;
  }

  /**
   * Sets the application's root directory.
   *
   * @param value Root directory to store in the configuration.
   */
  set rootDir(value: string) {
    this.map.set("rootDir", value);
  }

  /**
   * Gets the active runtime environment.
   */
  get env(): Env {
    return this.map.get("env");
  }

  /**
   * Sets the active runtime environment.
   *
   * @param value Environment to store in the configuration.
   */
  set env(value: Env) {
    this.map.set("env", value);
  }

  /**
   * Gets the providers and modules imported by the application.
   */
  get imports(): (TokenProvider | ImportTokenProviderOpts)[] {
    return this.get("imports")!;
  }

  /**
   * Sets the providers and modules imported by the application.
   *
   * @param imports Provider tokens or import options to configure.
   */
  set imports(imports: (TokenProvider | ImportTokenProviderOpts)[]) {
    this.map.set("imports", imports);
  }

  /**
   * Indicates whether synchronous singleton providers without hooks are deferred until first use.
   */
  get lazyProviders(): boolean {
    return this.get("lazyProviders")!;
  }

  /**
   * Enables or disables deferred initialization of synchronous singleton providers without hooks.
   *
   * @param lazyProviders Whether to defer eligible providers.
   */
  set lazyProviders(lazyProviders: boolean) {
    this.map.set("lazyProviders", lazyProviders);
  }

  /**
   * Gets the route providers registered by the application.
   */
  get routes(): TokenRoute[] {
    return this.get("routes")!;
  }

  /**
   * Sets the route providers registered by the application.
   *
   * @param routes Route providers to configure.
   */
  set routes(routes: TokenRoute[]) {
    this.map.set("routes", routes);
  }

  /**
   * Gets the logger options.
   */
  get logger(): Partial<DILoggerOptions> {
    return this.get("logger")!;
  }

  /**
   * Merges logger options into the current logger configuration.
   *
   * @param value Logger options to merge.
   */
  set logger(value: Partial<DILoggerOptions>) {
    const logger = {...this.logger, ...value};
    this.map.set("logger", logger);
  }

  /**
   * Indicates whether the logger is configured at the `debug` level.
   */
  get debug(): boolean {
    return this.logger.level === "debug";
  }

  /**
   * Enables or disables debug-level logging.
   *
   * @param debug `true` to set the logger level to `debug`; `false` to set it to `info`.
   */
  set debug(debug: boolean) {
    this.logger = {...this.logger, level: debug ? "debug" : "info"};
  }

  /**
   * Gets route providers grouped by mount path.
   */
  get mount(): Record<string, TokenProvider[]> {
    return this.get("mount");
  }

  /**
   * Sets route providers grouped by mount path.
   *
   * @param value Route providers indexed by mount path.
   */
  set mount(value: Record<string, TokenProvider[]>) {
    this.setRaw("mount", value);
  }

  /**
   * Invokes a callback once for each configured key, including default and overridden values.
   *
   * @param callbackfn Callback invoked with the resolved value, key, and override map.
   * @param thisArg Value to use as `this` when invoking the callback.
   */
  forEach(callbackfn: (value: any, index: string, map: Map<string, any>) => void, thisArg?: any) {
    return new Set([...Array.from(this.default.keys()), ...Array.from(this.map.keys())]).forEach((key) => {
      callbackfn(this.getRaw(key), key, this.map);
    }, thisArg);
  }

  /**
   * Sets one or more configuration values.
   *
   * Property names matching a configuration accessor are delegated to that accessor; other keys support nested paths.
   *
   * @param propertyKey Configuration key and value, or an object containing multiple values.
   * @param value Value to assign when `propertyKey` is a string.
   * @returns This configuration instance for chaining.
   */
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

  /**
   * Sets a configuration value directly in the override map, supporting nested property paths.
   *
   * @param propertyKey Configuration key or nested property path.
   * @param value Value to store.
   * @returns This configuration instance for chaining.
   */
  setRaw(propertyKey: string, value: any) {
    setValue(this.map, propertyKey, value);

    return this;
  }

  /**
   * Gets a resolved configuration value, preferring explicit overrides over default values.
   *
   * @param propertyKey Configuration key or nested property path.
   * @param defaultValue Value to return when neither the overrides nor defaults define the key.
   * @returns The resolved configuration value.
   */
  get<T = any>(propertyKey: string, defaultValue?: T): T {
    return this.getRaw(propertyKey, defaultValue);
  }

  /**
   * Defines a custom configuration member when a member with the same key does not already exist.
   *
   * @param key Name of the member to define.
   * @param value Function or property descriptor to assign to the configuration prototype.
   * @returns This configuration instance when the member already exists.
   */
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

  /**
   * Resolves a configuration value from overrides, defaults, or the supplied fallback in that order.
   *
   * @param propertyKey Configuration key or nested property path.
   * @param defaultValue Value to return when no configured value exists.
   * @returns The resolved configuration value.
   */
  protected getRaw(propertyKey: string, defaultValue?: any): any {
    const value = getValue(this.map, propertyKey);

    if (value !== undefined) {
      return value;
    }

    return getValue(this.default, propertyKey, defaultValue);
  }
}
