import {JsonMapper} from "../decorators/jsonMapper";
import {JsonMapperCtx, JsonMapperMethods} from "../interfaces/JsonMapperMethods";
import {mapDeserializeOptions, mapSerializeOptions} from "../utils/mapLegacyOptions";

/**
 * Converter component for the `Array` Type.
 * @jsonmapper
 * @converter
 * @component
 */
@JsonMapper(Array)
export class ArrayMapper implements JsonMapperMethods {
  /**
   * @deprecated
   */
  deserialize<T>(data: any, target: any, baseType?: T, deserializer?: Function): T[];
  deserialize<T = any>(data: any, options: JsonMapperCtx): T[];
  deserialize<T = any>(data: any, ...args: any[]): T[] {
    const options = mapSerializeOptions(args);

    return [].concat(data).map(item => options.next(item));
  }

  /**
   * @deprecated
   */
  serialize(data: any[], serializer: Function): any;
  serialize(data: any[], options: JsonMapperCtx): any;
  serialize(data: any[], ...args: any[]): any {
    const options: JsonMapperCtx = mapDeserializeOptions(args);

    return [].concat(data as any).map(item => options.next(item));
  }
}
