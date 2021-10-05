import {Configuration, Injectable, InjectorService} from "@tsed/di";
import {deserialize, JsonDeserializerOptions, JsonSerializerOptions, serialize} from "@tsed/json-mapper";
import {ConverterSettings} from "../config/interfaces/ConverterSettings";

/**
 * @deprecated Since 2021-10-03. Use serialize/deserialize functions from @tsed/json-mapper instead
 */
@Injectable()
export class ConverterService {
  #converterSettings: ConverterSettings;

  constructor(private injectorService: InjectorService, @Configuration() configuration: Configuration) {
    this.#converterSettings = configuration.get<ConverterSettings>("converter") || {};
  }

  /**
   * Convert instance to plainObject.
   *
   * @param obj
   * @param options
   */
  serialize(obj: any, options: JsonSerializerOptions = {}): any {
    return serialize(obj, {
      useAlias: true,
      additionalProperties: this.#converterSettings.additionalProperties === "accept",
      ...options
    });
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
  deserialize(obj: any, options: JsonDeserializerOptions = {}): any {
    return deserialize(obj, {
      useAlias: true,
      additionalProperties: this.#converterSettings.additionalProperties === "accept",
      ...options
    });
  }
}
