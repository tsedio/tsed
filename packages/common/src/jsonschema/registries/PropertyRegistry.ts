import {ancestorsOf, DecoratorParameters, Deprecated, Store, Type} from "@tsed/core";
import {PROPERTIES_METADATA} from "../../converters/constants/index";
import {PropertyMetadata} from "../class/PropertyMetadata";

export class PropertyRegistry {
  /**
   *
   * @param target
   * @param propertyKey
   * @returns {PropertyMetadata}
   */
  static get(target: Type<any>, propertyKey: string | symbol): PropertyMetadata {
    const properties = this.getOwnProperties(target);

    if (!properties.has(propertyKey)) {
      this.set(target, propertyKey, new PropertyMetadata(target, propertyKey));
    }

    return properties.get(propertyKey)!;
  }

  /**
   *
   * @param target
   * @returns {Array}
   */
  static getProperties(target: Type<any>): Map<string | symbol, PropertyMetadata> {
    const map = new Map<string | symbol, PropertyMetadata>();
    const ignored: string[] = [];

    ancestorsOf(target).forEach(klass => {
      this.getOwnProperties(klass).forEach((v: PropertyMetadata, k: string) => {
        /* istanbul ignore next */
        if (ignored.indexOf(k) !== -1) {
          return;
        }
        if (!v.ignoreProperty) {
          map.set(k, v);
        } else {
          map.delete(k);
          ignored.push(k);
        }
      });
    });

    return map;
  }

  /**
   *
   * @param {Type<any>} target
   * @returns {Map<string | symbol, PropertyMetadata>}
   */
  static getOwnProperties(target: Type<any>): Map<string | symbol, PropertyMetadata> {
    const store = Store.from(target);

    if (!store.has(PROPERTIES_METADATA)) {
      store.set(PROPERTIES_METADATA, new Map<string | symbol, PropertyMetadata>());
    }

    return store.get(PROPERTIES_METADATA);
  }

  /**
   *
   * @param target
   * @param propertyKey
   * @param property
   */
  static set(target: Type<any>, propertyKey: string | symbol, property: PropertyMetadata): void {
    const properties = this.getOwnProperties(target);

    properties.set(propertyKey, property);
  }

  /**
   *
   * @param target
   * @param propertyKey
   * @param allowedRequiredValues
   * @deprecated
   */
  // istanbul ignore next
  @Deprecated("PropertyRegistry.required is deprecated")
  static required(target: Type<any>, propertyKey: string | symbol, allowedRequiredValues: any[] = []) {
    const property = this.get(target, propertyKey);

    property.required = true;
    property.allowedRequiredValues = allowedRequiredValues.concat(property.allowedRequiredValues);

    this.set(target, propertyKey, property);
    this.get(target, propertyKey).store.merge("responses", {
      "400": {
        description: "BadRequest"
      }
    });

    return this;
  }

  /**
   *
   * @param {(propertyMetadata: PropertyMetadata, parameters: DecoratorParameters) => void} fn
   * @returns {Function}
   * @deprecated
   */
  // istanbul ignore next
  @Deprecated("PropertyRegistry.decorate is deprecated. Use PropertyFn instead.")
  static decorate(fn: (propertyMetadata: PropertyMetadata, parameters: DecoratorParameters) => void): Function {
    return (...parameters: any[]): any => {
      const propertyMetadata = PropertyRegistry.get(parameters[0], parameters[1]);
      const result: any = fn(propertyMetadata, parameters as DecoratorParameters);
      if (typeof result === "function") {
        result(...parameters);
      }
    };
  }
}
