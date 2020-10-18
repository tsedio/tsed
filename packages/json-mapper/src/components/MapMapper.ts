import {objectKeys} from "@tsed/core";
import {JsonMapper} from "../decorators/jsonMapper";
import {JsonMapperCtx, JsonMapperMethods} from "../interfaces/JsonMapperMethods";

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

    objectKeys(data).forEach((key) => {
      obj.set(key, ctx.next(data[key]) as T);
    });

    return obj;
  }

  serialize<T>(data: Map<string, T>, ctx: JsonMapperCtx): any {
    const obj: any = {};

    data.forEach((value: T, key: string) => (obj[key] = ctx.next(value)));

    return obj;
  }
}
