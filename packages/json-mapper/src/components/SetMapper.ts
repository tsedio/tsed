import {objectKeys} from "@tsed/core";
import {JsonMapper} from "../decorators/jsonMapper";
import {JsonMapperCtx, JsonMapperMethods} from "../interfaces/JsonMapperMethods";

/**
 * Converter component for the `Set` Type.
 * @converters
 * @jsonmapper
 * @component
 */
@JsonMapper(Set)
export class SetMapper implements JsonMapperMethods {
  deserialize<T>(data: any, ctx: JsonMapperCtx): Set<T> {
    const obj = new Set<T>();

    objectKeys(data).forEach((key) => {
      obj.add(ctx.next(data[key]));
    });

    return obj;
  }

  serialize<T>(data: Set<T>, ctx: JsonMapperCtx): any[] {
    const array: any[] = [];

    data.forEach((value) => array.push(ctx.next(value)));

    return array;
  }
}
