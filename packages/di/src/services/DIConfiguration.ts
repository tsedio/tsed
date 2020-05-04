import {classOf, deepExtends, getValue, setValue} from "@tsed/core";
import {IDIResolver, ProviderScope, TokenProvider} from "../interfaces";

export class DIConfiguration {
  readonly default: Map<string, any> = new Map();
  protected map: Map<string, any> = new Map();

  [key: string]: any;

  constructor(initialProps = {}) {
    Object.entries({
      scopes: {},
      resolvers: [],
      imports: [],
      ...initialProps
    }).forEach(([key, value]) => {
      this.default.set(key, value);
    });

    return new Proxy(this, {
      getOwnPropertyDescriptor(target: any, p: PropertyKey): PropertyDescriptor | undefined {
        return Reflect.getOwnPropertyDescriptor(target, p);
      },

      has(target: any, p: PropertyKey): boolean {
        if (Reflect.has(target, p) || typeof p === "symbol") {
          return Reflect.has(target, p);
        }

        return target.get(p as any) !== undefined;
      },

      get(target: any, p: PropertyKey, receiver: any): any {
        if (Reflect.has(target, p) || typeof p === "symbol") {
          return Reflect.get(target, p, receiver);
        }

        return target.get(p as any);
      },

      set(target: DIConfiguration, p: PropertyKey, value: any, receiver: any): boolean {
        if (Reflect.has(target, p) || typeof p === "symbol") {
          return Reflect.set(target, p, value, receiver);
        }

        return !!target.set(p as any, value);
      },

      deleteProperty(target: any, p: PropertyKey): boolean {
        return Reflect.deleteProperty(target, p);
      },

      defineProperty(target: any, p: PropertyKey, attributes: PropertyDescriptor): boolean {
        return Reflect.defineProperty(target, p, attributes);
      },

      ownKeys(target: DIConfiguration): PropertyKey[] {
        return Reflect.ownKeys(target)
          .concat(Array.from(target.default.keys()))
          .concat(Array.from(target.map.keys()));
      }
    });
  }

  get scopes(): {[key: string]: ProviderScope} {
    return this.getRaw("scopes");
  }

  set scopes(value: {[key: string]: ProviderScope}) {
    this.setRaw("scopes", value);
  }

  get resolvers(): IDIResolver[] {
    return this.getRaw("resolvers");
  }

  set resolvers(resolvers: IDIResolver[]) {
    this.setRaw("resolvers", resolvers);
  }

  get imports(): TokenProvider[] {
    return this.getRaw("imports");
  }

  set imports(imports: TokenProvider[]) {
    this.setRaw("imports", imports);
  }

  /**
   *
   * @param callbackfn
   * @param thisArg
   */
  forEach(callbackfn: (value: any, index: string, map: Map<string, any>) => void, thisArg?: any) {
    return new Set([...Array.from(this.default.keys()), ...Array.from(this.map.keys())]).forEach(key => {
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
      this.setRaw(propertyKey, value);
    } else {
      Object.entries(propertyKey).forEach(([key, value]) => {
        this[key] = value;
      });
    }

    return this;
  }

  setRaw(propertyKey: string, value: any) {
    setValue(propertyKey, value, this.map);

    return this;
  }

  /**
   *
   * @param propertyKey
   * @returns {undefined|any}
   */
  get<T = any>(propertyKey: string): T {
    return this.resolve(this.getRaw(propertyKey));
  }

  getRaw(propertyKey: string): any {
    const value = getValue(propertyKey, this.map);

    if (value !== undefined) {
      return value;
    }

    return getValue(propertyKey, this.default);
  }

  merge(obj: Partial<TsED.Configuration>) {
    Object.entries(obj).forEach(([key, value]) => {
      const descriptor = Object.getOwnPropertyDescriptor(DIConfiguration.prototype, key);
      const originalValue = this.get(key);
      value = deepExtends(value, originalValue);

      if (descriptor && !["default", "set", "map", "get"].includes(key)) {
        this[key] = value;
      }
    });
  }

  /**
   *
   * @param value
   * @returns {any}
   */
  resolve(value: any) {
    if (typeof value === "object" && value !== null) {
      if (![Array, Object].includes(classOf(value))) {
        return value;
      }

      return Object.entries(value).reduce(
        (o, [k, v]) => {
          // @ts-ignore
          o[k] = this.resolve(v);

          return o;
        },
        Array.isArray(value) ? [] : {}
      );
    }

    if (typeof value === "string") {
      return value
        .replace(/\${([\w.]+)}/gi, (match, key) => getValue(key, this.map))
        .replace(/<([\w.]+)>/gi, (match, key) => getValue(key, this.map))
        .replace(/{{([\w.]+)}}/gi, (match, key) => getValue(key, this.map));
    }

    return value;
  }

  build() {
    this.forEach((value, key) => this.map.set(key, this.resolve(value)));

    this.set = this.setRaw;
    this.get = this.getRaw = (propertyKey: string) => getValue(propertyKey, this.map);
  }
}
