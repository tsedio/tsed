import {JsonMapper} from "../decorators/jsonMapper";
import {JsonMapperCtx, JsonMapperMethods} from "../interfaces/JsonMapperMethods";

/**
 * Mapper for `Array` type.
 * @jsonmapper
 * @component
 */
@JsonMapper(Array)
export class ArrayMapper implements JsonMapperMethods {
  deserialize<T = any>(data: any, options: JsonMapperCtx): T[] {
    return [].concat(data).map(item => options.next(item));
  }

  serialize(data: any[], options: JsonMapperCtx): any {
    return [].concat(data as any).map(item => options.next(item));
  }
}
