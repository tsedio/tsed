import {classOf, Env, getValue, proxyDelegation, setValue} from "@tsed/core";
import type {ProviderScope} from "../domain/ProviderScope";
import type {DILoggerOptions} from "../interfaces/DILoggerOptions";
import type {DIResolver} from "../interfaces/DIResolver";
import type {TokenProvider} from "../interfaces/TokenProvider";
import type {TokenRoute} from "../interfaces/TokenRoute";

export class DIConfiguration {
  readonly default: Map<string, any> = new Map();
  protected map: Map<string, any> = new Map();

  constructor(initialProps = {}) {
    Object.entries({
      scopes: {},
      resolvers: [],
      imports: [],
      routes: [],
      logger: {},
      ...initialProps
    }).forEach(([key, value]) => {
      this.default.set(key, value);
    });

    return proxyDelegation<DIConfiguration>(this, {
      ownKeys(target) {
        return [...target.default.keys(), ...target.map.keys()];
      }
    });
  }

  get version() {
    return this.get("version");
  }

  set version(v: string) {
    this.map.set("version", v);
  }

  get rootDir() {
    return this.get("rootDir");
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

  get scopes(): Record<string, ProviderScope> {
    return this.map.get("scopes");
  }

  set scopes(value: Record<string, ProviderScope>) {
    this.map.set("scopes", value);
  }

  get resolvers(): DIResolver[] {
    return this.getRaw("resolvers");
  }

  set resolvers(resolvers: DIResolver[]) {
    this.map.set("resolvers", resolvers);
  }

  get imports(): TokenProvider[] {
    return this.get("imports");
  }

  set imports(imports: TokenProvider[]) {
    this.map.set("imports", imports);
  }

  get routes(): TokenRoute[] {
    return this.get("routes");
  }

  set routes(routes: TokenRoute[]) {
    this.map.set("routes", routes);
  }

  get logger(): Partial<DILoggerOptions> {
    return this.get("logger");
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

  /**
   *
   * @param propertyKey
   * @param value
   */
  set(propertyKey: string | Partial<TsED.Configuration>, value?: any): this {
    if (typeof propertyKey === "string") {
      if (propertyKey in this) {
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

  protected getRaw(propertyKey: string, defaultValue?: any): any {
    const value = getValue(this.map, propertyKey);

    if (value !== undefined) {
      return value;
    }

    return getValue(this.default, propertyKey, defaultValue);
  }

  /**
   *
   * @param value
   * @returns {any}
   */
  resolve(value: any) {
    return value.replace("${rootDir}", this.rootDir);
  }
}
