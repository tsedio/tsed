import {getValue, setValue} from "@tsed/core";
import {IDISettings} from "../interfaces/IDISettings";
import {ProviderScope} from "../interfaces/ProviderScope";

export class DISettings implements IDISettings {
  protected map: Map<string, any> = new Map();

  [key: string]: any;

  constructor(initialProps = {}) {
    this.set({
      scopes: {},
      ...initialProps
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
  set(propertyKey: string | any, value?: any): this {
    if (typeof propertyKey === "string") {
      setValue(propertyKey, value, this.map);
    } else {
      Object.keys(propertyKey).forEach(key => {
        const descriptor = Object.getOwnPropertyDescriptor(DISettings.prototype, key);

        if (descriptor && ["set", "map", "get"].indexOf(key) === -1) {
          this[key] = propertyKey[key];
        } else {
          this.set(key, propertyKey[key]);
        }
      });

      this.forEach((value, key) => {
        this.map.set(key, this.resolve(value));
      });
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

  /**
   *
   * @param value
   * @returns {any}
   */
  resolve(value: any) {
    if (typeof value === "object" && value !== null) {
      Object.keys(value).forEach((k: string, i: number, m: any) => {
        value[k] = this.resolve(value[k]);
      });

      return value;
    }

    if (typeof value === "string") {
      return value.replace(/\${(\w+)}/gi, (match, key) => this.map.get(key));
    }

    return value;
  }
}
