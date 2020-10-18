import {objectKeys} from "@tsed/core";
import {Converter} from "../decorators/converter";
import {IConverter, IDeserializer, ISerializer} from "../interfaces/index";

/**
 * Converter component for the `Map` Type.
 * @converters
 * @component
 */
@Converter(Map)
export class MapConverter implements IConverter {
  /**
   *
   * @param data
   * @param target
   * @param baseType
   * @param deserializer
   * @returns {Map<string, T>}
   */
  deserialize<T>(data: any, target: any, baseType: T, deserializer: IDeserializer): Map<string, T> {
    const obj = new Map<string, T>();

    objectKeys(data).forEach((key) => {
      obj.set(key, deserializer(data[key], baseType) as T);
    });

    return obj;
  }

  /**
   *
   * @param data
   * @param serializer
   */
  serialize<T>(data: Map<string, T>, serializer: ISerializer): any {
    const obj: any = {};

    data.forEach((value: T, key: string) => (obj[key] = serializer(value)));

    return obj;
  }
}
