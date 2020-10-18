import {getClass, isArrayOrArrayClass, isEmpty, isPrimitiveOrPrimitiveClass, Metadata, objectKeys, Type} from "@tsed/core";
import {Configuration, Injectable, InjectorService} from "@tsed/di";
import {IConverterSettings} from "../../config/interfaces/IConverterSettings";
import {PropertyMetadata} from "../../mvc/models/PropertyMetadata";
import {getJsonSchema} from "../../jsonschema/utils/getJsonSchema";
import {ArrayConverter, DateConverter, MapConverter, PrimitiveConverter, SetConverter, SymbolConverter} from "../components";
import {CONVERTER} from "../constants/index";
import {RequiredPropertyError} from "../errors/RequiredPropertyError";
import {UnknownPropertyError} from "../errors/UnknownPropertyError";
import {IConverter, IConverterOptions, IDeserializer, ISerializer} from "../interfaces/index";

@Injectable({
  imports: [ArrayConverter, DateConverter, MapConverter, PrimitiveConverter, SetConverter, SymbolConverter]
})
export class ConverterService {
  private converterSettings: IConverterSettings;

  constructor(private injectorService: InjectorService, @Configuration() configuration: Configuration) {
    this.converterSettings = configuration.get<IConverterSettings>("converter") || {};

    if (this.converterSettings.additionalProperties === undefined) {
      const validationModelStrict = configuration.get<boolean>("validationModelStrict");
      this.converterSettings.additionalProperties = validationModelStrict || validationModelStrict === undefined ? "error" : "accept";
    }
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
    properties.forEach((p) => {
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
    const properties = PropertyMetadata.getProperties(options.type || obj, {withIgnoredProps});
    const keys = properties.size ? Array.from(properties.keys()) : objectKeys(obj);

    keys.forEach((propertyKey) => {
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
    const properties = PropertyMetadata.getProperties(targetType);

    objectKeys(obj).forEach((propertyName: string) => {
      const propertyMetadata = ConverterService.getPropertyMetadata(properties, propertyName);

      return this.convertProperty(obj, instance, propertyName, propertyMetadata, options);
    });

    // Required validation
    if (checkRequiredValue) {
      // TODO v6 REMOVE REQUIRED check
      this.checkRequiredValue(instance, properties);
    }

    return instance;
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
   * @param {Type<any>} target
   * @returns {"error" | "accept" | "ignore"}
   */
  public getAdditionalPropertiesLevel(target: Type<any>) {
    if (target !== Object) {
      const {additionalProperties} = getJsonSchema(target);

      if (additionalProperties !== undefined) {
        return !additionalProperties ? "error" : "accept";
      }

      return this.converterSettings.additionalProperties;
    }

    return "accept";
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
    if (this.skipAdditionalProperty(instance, propertyName, propertyMetadata, options)) {
      return;
    }

    propertyMetadata = propertyMetadata || ({} as any);

    let propertyValue = obj[propertyMetadata!.name] || obj[propertyName];
    const propertyKey = propertyMetadata!.propertyKey || propertyName;

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
  }

  /**
   * @deprecated
   * @param instance
   * @param {Map<string | symbol, PropertyMetadata>} properties
   */
  private checkRequiredValue(instance: any, properties: Map<string | symbol, PropertyMetadata>) {
    properties.forEach((propertyMetadata: PropertyMetadata) => {
      const value = instance[propertyMetadata.propertyKey!];
      if (propertyMetadata.isRequired(value)) {
        throw new RequiredPropertyError(getClass(instance), propertyMetadata.propertyKey!, value);
      }
    });
  }

  /**
   *
   * @param instance
   * @param {string} propertyKey
   * @param {PropertyMetadata | undefined} propertyMetadata
   * @param options
   */
  private skipAdditionalProperty(
    instance: any,
    propertyKey: string | symbol,
    propertyMetadata: PropertyMetadata | undefined,
    options: any
  ) {
    if (propertyMetadata !== undefined) {
      return false;
    }

    const additionalPropertiesLevel = options.additionalProperties || this.getAdditionalPropertiesLevel(getClass(instance));

    switch (additionalPropertiesLevel) {
      case "error":
        throw new UnknownPropertyError(getClass(instance), propertyKey);
      case "ignore":
        return true;
      case "accept":
        return false;
    }
  }
}
