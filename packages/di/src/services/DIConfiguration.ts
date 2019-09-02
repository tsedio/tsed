import {deepClone, deepExtends, getValue, setValue} from "@tsed/core";
import {IDIConfigurationOptions} from "../interfaces/IDIConfigurationOptions";
import {ProviderScope} from "../interfaces/ProviderScope";

export class DIConfiguration {
  protected map: Map<string, any> = new Map();

  [key: string]: any;

  constructor(initialProps = {}) {
    this.set({
      scopes: {},
      ...initialProps
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
        return Reflect.ownKeys(target).concat(Array.from(target.map.keys()));
      }
    });
  }

  get scopes(): {[key: string]: ProviderScope} {
    return this.map.get("scopes");
  }

  set scopes(value: {[key: string]: ProviderScope}) {
    this.map.set("scopes", value);
  }

  /**
   *
   * @param callbackfn
   * @param thisArg
   */
  forEach(callbackfn: (value: any, index: string, map: Map<string, any>) => void, thisArg?: any) {
    return this.map.forEach(callbackfn, thisArg);
  }

  /**
   *
   * @param propertyKey
   * @param value
   */
  set(propertyKey: string | Partial<IDIConfigurationOptions>, value?: any): this {
    if (typeof propertyKey === "string") {
      setValue(propertyKey, value, this.map);
    } else {
      Object.assign(this, propertyKey);
    }

    return this;
  }

  /**
   *
   * @param propertyKey
   * @returns {undefined|any}
   */
  get<T>(propertyKey: string): T {
    return this.resolve(getValue(propertyKey, this.map));
  }

  merge(obj: Partial<IDIConfigurationOptions>) {
    Object.entries(obj).forEach(([key, value]) => {
      const descriptor = Object.getOwnPropertyDescriptor(DIConfiguration.prototype, key);
      const originalValue = this.get(key);
      value = deepExtends(value, originalValue);

      if (descriptor && ["set", "map", "get"].indexOf(key) === -1) {
        this[key] = value;
      } else {
        this.set(key, value);
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
      Object.entries(value).forEach(([k, v]) => {
        value[k] = this.resolve(v);
      });

      return value;
    }

    if (typeof value === "string") {
      return value.replace(/\${([\w.]+)}/gi, (match, key) => getValue(key, this.map));
    }

    return value;
  }

  toRawObject(): IDIConfigurationOptions {
    return Array.from(this.map.entries()).reduce((obj: any, [key, value]) => {
      obj[key] = deepClone(value);

      return obj;
    }, {});
  }
}
