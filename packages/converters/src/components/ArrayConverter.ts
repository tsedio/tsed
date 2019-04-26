import {Converter} from "../decorators/converter";
import {IConverter, IDeserializer, ISerializer} from "../interfaces/index";

/**
 * Converter component for the `Array` Type.
 * @private
 * @converters
 * @component
 */
@Converter(Array)
export class ArrayConverter implements IConverter {
  /**
   *
   * @param data
   * @param target
   * @param baseType
   * @param deserializer
   * @returns {any[]}
   */
  deserialize<T>(data: any, target: any, baseType: T, deserializer: IDeserializer): T[] {
    return [].concat(data).map(item => deserializer!(item, baseType));
  }

  /**
   *
   * @param data
   * @param serializer
   * @returns {any[]}
   */
  serialize(data: any[], serializer: ISerializer) {
    return [].concat(data as any).map(item => serializer(item));
  }
}
