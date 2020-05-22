import {JsonMapper} from "../decorators/jsonMapper";
import {JsonMapperMethods, JsonMapperCtx} from "../interfaces/JsonMapperMethods";

/**
 * Converter component for the `Map` Type.
 * @jsonmapper
 * @converter
 * @component
 */
@JsonMapper(Map)
export class MapMapper implements JsonMapperMethods {
  deserialize<T = any, C = Map<string, T>>(data: {[key: string]: any}, ctx: JsonMapperCtx<T, C>): Map<string, T> {
    const obj = new Map<string, T>();

    Object.keys(data).forEach(key => {
      obj.set(key, ctx.next(data[key]) as T);
    });

    return obj;
  }

  /**
   *
   * @param data
   * @param ctx
   */
  serialize<T>(data: Map<string, T>, ctx: JsonMapperCtx): any {
    const obj: any = {};

    data.forEach((value: T, key: string) => (obj[key] = ctx.next(value)));

    return obj;
  }
}
