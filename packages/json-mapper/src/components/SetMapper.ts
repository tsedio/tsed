import {JsonMapper} from "../decorators/jsonMapper";
import {JsonMapperCtx, JsonMapperMethods} from "../interfaces/JsonMapperMethods";
import {mapDeserializeOptions, mapSerializeOptions} from "../utils/mapLegacyOptions";

/**
 * Converter component for the `Set` Type.
 * @converters
 * @jsonmapper
 * @component
 */
@JsonMapper(Set)
export class SetMapper implements JsonMapperMethods {
  deserialize<T>(data: any, target: any, baseType: T, deserializer: Function): Set<T>;
  deserialize<T>(data: any, ctx: JsonMapperCtx): Set<T>;
  deserialize<T>(data: any, ...args: any[]): Set<T> {
    const ctx = mapSerializeOptions(args);
    const obj = new Set<T>();

    Object.keys(data).forEach(key => {
      obj.add(ctx.next(data[key]));
    });

    return obj;
  }

  serialize<T>(data: Set<T>, serializer: Function): any[];
  serialize<T>(data: Set<T>, ctx: JsonMapperCtx): any[];
  serialize<T>(data: Set<T>, ...args: any[]): any[] {
    const ctx: JsonMapperCtx = mapDeserializeOptions(args);
    const array: any[] = [];

    data.forEach(value => array.push(ctx.next(value)));

    return array;
  }
}
