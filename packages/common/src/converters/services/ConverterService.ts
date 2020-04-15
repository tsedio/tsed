import {getClass, isArrayOrArrayClass, isEmpty, isPrimitiveOrPrimitiveClass, Metadata, Store, Type} from "@tsed/core";
import {Configuration, GlobalProviders, Injectable, InjectorService} from "@tsed/di";
import {BadRequest} from "ts-httpexceptions";
import {PropertyMetadata} from "../../jsonschema/class/PropertyMetadata";
import {PropertyRegistry} from "../../jsonschema/registries/PropertyRegistry";
import {ArrayConverter, DateConverter, MapConverter, PrimitiveConverter, SetConverter, SymbolConverter} from "../components";
import {CONVERTER} from "../constants/index";
import {ConverterDeserializationError} from "../errors/ConverterDeserializationError";
import {ConverterSerializationError} from "../errors/ConverterSerializationError";
import {RequiredPropertyError} from "../errors/RequiredPropertyError";
import {UnknownPropertyError} from "../errors/UnknownPropertyError";
import {IConverter, IConverterOptions, IDeserializer, ISerializer} from "../interfaces/index";
import {IConverterSettings} from "../../config/interfaces/IConverterSettings";

@Injectable({
  imports: [ArrayConverter, DateConverter, MapConverter, PrimitiveConverter, SetConverter, SymbolConverter]
})
export class ConverterService {
  private validationModelStrict = true;
  private converterSettings: IConverterSettings;

  constructor(private injectorService: InjectorService, @Configuration() configuration: Configuration) {
    this.validationModelStrict = configuration.get<boolean>("validationModelStrict");
    this.converterSettings = configuration.get<IConverterSettings>("converter") || {};
  }

  /**
   * Return a JsonMetadata for a properties.
   * @param properties
   * @param propertyKey
   * @returns {undefined|V|string|any|T|IDBRequest}
   */
  static getPropertyMetadata(
    properties: Map<string | symbol, PropertyMetadata>,
    propertyKey: string | symbol
  ): PropertyMetadata | undefined {
    if (properties.has(propertyKey)) {
      return properties.get(propertyKey);
    }

    let property;
    properties.forEach(p => {
      if (p.name === propertyKey || p.propertyKey === propertyKey) {
        property = p;
      }
    });

    return property;
  }

  /**
   * Convert instance to plainObject.
   *
   * ### Options
   *
   * - `checkRequiredValue`: Disable the required check condition.
   *
   * @param obj
   * @param options
   */
  serialize(obj: any, options: IConverterOptions = {}): any {
    try {
      if (isEmpty(obj)) {
        return obj;
      }

      const converter = this.getConverter(obj);
      const serializer: ISerializer = (o: any, opt?: any) => this.serialize(o, Object.assign({}, options, opt));

      if (converter && converter.serialize) {
        // serialize from a custom JsonConverter
        return converter.serialize(obj, serializer);
      }

      if (typeof obj.serialize === "function") {
        // serialize from serialize method
        return obj.serialize(options, this);
      }

      if (typeof obj.toJSON === "function" && !obj.toJSON.$ignore) {
        // serialize from serialize method
        return obj.toJSON();
      }

      // Default converter
      if (!isPrimitiveOrPrimitiveClass(obj)) {
        return this.serializeClass(obj, options);
      }
    } catch (err) {
      /* istanbul ignore next */
      throw err.name === "BAD_REQUEST" ? err : new ConverterSerializationError(getClass(obj), err);
    }

    /* istanbul ignore next */
    return obj;
  }

  /**
   *
   * @param obj
   * @param {IConverterOptions} options
   * @returns {any}
   */
  serializeClass(obj: any, options: IConverterOptions = {}) {
    const {checkRequiredValue = true, withIgnoredProps} = options;

    const plainObject: any = {};
    const properties = PropertyRegistry.getProperties(options.type || obj, {withIgnoredProps});
    const keys = properties.size ? Array.from(properties.keys()) : Object.keys(obj);

    keys.forEach(propertyKey => {
      if (typeof obj[propertyKey] !== "function") {
        let propertyMetadata = ConverterService.getPropertyMetadata(properties, propertyKey);
        let propertyValue = obj[propertyKey];
        propertyMetadata = propertyMetadata || ({} as any);

        propertyValue = this.serialize(propertyValue, {
          checkRequiredValue,
          withIgnoredProps,
          type: propertyMetadata!.type
        });

        if (typeof propertyMetadata!.onSerialize === "function") {
          propertyValue = propertyMetadata!.onSerialize(propertyValue);
        }

        plainObject[propertyMetadata!.name || propertyKey] = propertyValue;
      }
    });

    // Required validation
    if (checkRequiredValue) {
      this.checkRequiredValue(obj, properties);
    }

    return plainObject;
  }

  /**
   * Convert a plainObject to targetType.
   *
   * ### Options
   *
   * - `ignoreCallback`: callback called for each object which will be deserialized. The callback can return a boolean to avoid the default converter behavior.
   * - `checkRequiredValue`: Disable the required check condition.
   *
   * @param obj Object source that will be deserialized
   * @param targetType Pattern of the object deserialized
   * @param baseType
   * @param options
   * @returns {any}
   */
  deserialize(obj: any, targetType: any, baseType?: any, options: IConverterOptions = {}): any {
    const {ignoreCallback, checkRequiredValue = true} = options;

    try {
      if (ignoreCallback && ignoreCallback(obj, targetType, baseType)) {
        return obj;
      }

      if (targetType !== Boolean && (isEmpty(obj) || isEmpty(targetType) || targetType === Object)) {
        return obj;
      }

      const converter = this.getConverter(targetType);
      const deserializer: IDeserializer = (o: any, targetType: any, baseType: any) => this.deserialize(o, targetType, baseType, options);

      if (converter) {
        // deserialize from a custom JsonConverter
        return converter!.deserialize!(obj, targetType, baseType, deserializer);
      }

      /* istanbul ignore next */
      if (isArrayOrArrayClass(obj)) {
        const converter = this.getConverter(Array);

        return converter!.deserialize!(obj, Array, baseType, deserializer);
      }

      if ((targetType as any).prototype && typeof (targetType as any).prototype.deserialize === "function") {
        // deserialize from method

        const instance = new targetType();
        instance.deserialize(obj);

        return instance;
      }

      // Default converter
      const instance = new targetType();
      const properties = PropertyRegistry.getProperties(targetType);

      Object.keys(obj).forEach((propertyName: string) => {
        const propertyMetadata = ConverterService.getPropertyMetadata(properties, propertyName);

        return this.convertProperty(obj, instance, propertyName, propertyMetadata, options);
      });

      // Required validation
      if (checkRequiredValue) {
        this.checkRequiredValue(instance, properties);
      }

      return instance;
    } catch (err) {
      /* istanbul ignore next */
      throw err.name === "BAD_REQUEST" ? err : new ConverterDeserializationError(targetType, obj, err);
    }
  }

  /**
   *
   * @param targetType
   * @returns {any}
   */
  getConverter<T extends IConverter>(targetType: any): T | undefined {
    if (Metadata.has(CONVERTER, targetType)) {
      const converter = Metadata.get(CONVERTER, targetType);

      if (converter) {
        return this.injectorService.get(converter);
      }
    }
  }

  /**
   *
   * @param obj
   * @param instance
   * @param {string} propertyName
   * @param {PropertyMetadata} propertyMetadata
   * @param options
   */
  private convertProperty(obj: any, instance: any, propertyName: string, propertyMetadata?: PropertyMetadata, options?: any) {
    if (this.skipAdditionalProperty(instance, propertyName, propertyMetadata)) {
      return;
    }

    propertyMetadata = propertyMetadata || ({} as any);

    let propertyValue = obj[propertyMetadata!.name] || obj[propertyName];
    const propertyKey = propertyMetadata!.propertyKey || propertyName;

    try {
      if (typeof instance[propertyKey] !== "function") {
        if (typeof propertyMetadata!.onDeserialize === "function") {
          propertyValue = propertyMetadata!.onDeserialize(propertyValue);
        }

        instance[propertyKey] = this.deserialize(
          propertyValue,
          propertyMetadata!.isCollection ? propertyMetadata!.collectionType : propertyMetadata!.type,
          propertyMetadata!.type,
          options
        );
      }
    } catch (err) {
      /* istanbul ignore next */
      (() => {
        const castedErrorMessage = `Error for ${propertyName} with value ${JSON.stringify(propertyValue)} \n ${err.message}`;
        if (err instanceof BadRequest) {
          throw new BadRequest(castedErrorMessage);
        }
        const castedError: any = new Error(castedErrorMessage);
        castedError.status = err.status;
        castedError.stack = err.stack;
        castedError.origin = err;

        throw castedError;
      })();
    }
  }

  /**
   *
   * @param instance
   * @param {Map<string | symbol, PropertyMetadata>} properties
   */
  private checkRequiredValue(instance: any, properties: Map<string | symbol, PropertyMetadata>) {
    properties.forEach((propertyMetadata: PropertyMetadata) => {
      const value = instance[propertyMetadata.propertyKey];
      if (propertyMetadata.isRequired(value)) {
        throw new RequiredPropertyError(getClass(instance), propertyMetadata.propertyKey, value);
      }
    });
  }

  /**
   *
   * @param instance
   * @param {string} propertyKey
   * @param {PropertyMetadata | undefined} propertyMetadata
   */
  private skipAdditionalProperty(instance: any, propertyKey: string | symbol, propertyMetadata: PropertyMetadata | undefined) {
    if (propertyMetadata !== undefined) {
      return false; // Property isn't an additional property
    }

    const additionalPropertyLevel = this.getAdditionalPropertyLevel(getClass(instance));

    switch (additionalPropertyLevel) {
      case "error":
        throw new UnknownPropertyError(getClass(instance), propertyKey);
      case "ignore":
        return true;
      default:
      case "accept":
        return false;
    }
  }

  /**
   *
   * @param {Type<any>} target
   * @returns {"error" | "accept" | "ignore"}
   */
  private getAdditionalPropertyLevel(target: Type<any>) {
    if (target !== Object) {
      if (Store.from(target).has("modelStrict")) {
        const modelStrict = Store.from(target).get("modelStrict");

        return modelStrict === undefined || modelStrict ? "error" : "accept";
      }
      if (this.converterSettings.additionalProperty !== undefined) {
        return this.converterSettings.additionalProperty;
      }

      return this.validationModelStrict ? "error" : "accept";
    }

    return "accept";
  }
}
