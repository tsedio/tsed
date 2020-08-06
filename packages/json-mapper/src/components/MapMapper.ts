import {JsonMapper} from "../decorators/jsonMapper";
import {JsonMapperCtx, JsonMapperMethods} from "../interfaces/JsonMapperMethods";
import {mapDeserializeOptions, mapSerializeOptions} from "../utils/mapLegacyOptions";

/**
 * Converter component for the `Map` Type.
 * @jsonmapper
 * @converter
 * @component
 */
@JsonMapper(Map)
export class MapMapper implements JsonMapperMethods {
  /**
   * @deprecated
   */
  deserialize<T>(data: any, target: any, baseType: T, deserializer: Function): Map<string, T>;
  deserialize<T = any, C = Map<string, T>>(data: {[key: string]: any}, ctx: JsonMapperCtx<T, C>): Map<string, T>;
  deserialize<T = any, C = Map<string, T>>(data: {[key: string]: any}, ...args: any[]): Map<string, T> {
    const ctx = mapSerializeOptions(args);
    const obj = new Map<string, T>();

    Object.keys(data).forEach(key => {
      obj.set(key, ctx.next(data[key]) as T);
    });

    return obj;
  }

  /**
   * @deprecated
   */
  serialize<T>(data: Map<string, T>, serializer: Function): any;
  serialize<T>(data: Map<string, T>, ctx: JsonMapperCtx): any;
  serialize<T>(data: Map<string, T>, ...args: any[]): any {
    const ctx: JsonMapperCtx = mapDeserializeOptions(args);
    const obj: any = {};

    data.forEach((value: T, key: string) => (obj[key] = ctx.next(value)));

    return obj;
  }
}
