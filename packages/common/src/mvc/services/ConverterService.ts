import {classOf, MetadataTypes, Type} from "@tsed/core";
import {Configuration, Injectable, InjectorService} from "@tsed/di";
import {classToPlainObject, deserialize, JsonDeserializerOptions, JsonSerializerOptions, serialize} from "@tsed/json-mapper";
import {ConverterSettings} from "../../config/interfaces/ConverterSettings";

/**
 * @deprecated
 */
export interface ConverterOptions extends MetadataTypes {
  withIgnoredProps?: boolean;
  additionalProperties?: "error" | "ignore" | "accept";

  [key: string]: any;
}

/**
 * @ignore
 * @param args
 */
function mapDeserializeOptions(args: any[]) {
  if (args.length >= 2) {
    const [targetType, baseType, options = {}] = args;

    return {
      ...options,
      type: baseType,
      collectionType: targetType,
      additionalProperties: options.additionalProperties === "accept"
    };
  }

  if (args.length === 1) {
    if (classOf(args[0]) !== Object) {
      return {
        type: args[0]
      };
    }

    return args[0];
  }

  return {};
}

@Injectable()
export class ConverterService {
  private converterSettings: ConverterSettings;

  constructor(private injectorService: InjectorService, @Configuration() configuration: Configuration) {
    this.converterSettings = configuration.get<ConverterSettings>("converter") || {};
  }

  /**
   * Convert instance to plainObject.
   *
   * @param obj
   * @param options
   */
  serialize(obj: any, options?: JsonSerializerOptions): any;
  /**
   * @deprecated
   */
  serialize(obj: any, options?: ConverterOptions): any;
  serialize(obj: any, options: ConverterOptions | JsonSerializerOptions = {}): any {
    return serialize(obj, {
      additionalProperties: this.converterSettings.additionalProperties === "accept",
      ...options
    });
  }

  /**
   * @deprecated Use classToPlainObject from @tsed/json-mapper instead
   */
  serializeClass(obj: any, options: ConverterOptions = {}) {
    return classToPlainObject(obj, options);
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
   * @param options Mapping options
   * @returns {any}
   */
  deserialize(obj: any, options?: JsonDeserializerOptions): any;
  /**
   * @deprecated
   */
  deserialize(obj: any, type: any, options?: ConverterOptions): any;
  /**
   * @deprecated
   */
  deserialize(obj: any, collectionType: any, baseType: any, options?: ConverterOptions): any;
  deserialize(
    obj: any,
    ...args:
      | any[]
      | [any | JsonDeserializerOptions]
      | [Type<any> | any, Type<any> | any]
      | [Type<any> | any, Type<any> | any | undefined, ConverterOptions]
  ): any {
    const options = {
      additionalProperties: this.converterSettings.additionalProperties === "accept",
      ...mapDeserializeOptions(args)
    };

    return deserialize(obj, options);
  }
}
