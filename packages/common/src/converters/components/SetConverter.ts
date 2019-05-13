import {Converter} from "../decorators/converter";
import {IConverter, IDeserializer, ISerializer} from "../interfaces/index";

/**
 * Converter component for the `Set` Type.
 * @converters
 * @component
 */
@Converter(Set)
export class SetConverter implements IConverter {
  /**
   *
   * @param data
   * @param target
   * @param baseType
   * @param deserializer
   * @returns {Map<string, T>}
   */
  deserialize<T>(data: any, target: any, baseType: T, deserializer: IDeserializer): Set<T> {
    const obj = new Set<T>();

    Object.keys(data).forEach(key => {
      obj.add(deserializer(data[key], baseType) as T);
    });

    return obj;
  }

  /**
   *
   * @param data
   * @param serializer
   */
  serialize<T>(data: Set<T>, serializer: ISerializer): any[] {
    const array: any[] = [];

    data.forEach(value => array.push(serializer(value)));

    return array;
  }
}
