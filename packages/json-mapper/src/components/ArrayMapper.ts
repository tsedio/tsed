import {JsonMapper} from "../decorators/jsonMapper";
import {JsonMapperCtx, JsonMapperMethods} from "../interfaces/JsonMapperMethods";

/**
 * Converter component for the `Array` Type.
 * @jsonmapper
 * @converter
 * @component
 */
@JsonMapper(Array)
export class ArrayMapper implements JsonMapperMethods {
  deserialize<T = any>(data: any, options: JsonMapperCtx): T[] {
    return [].concat(data).map(item => options.next(item));
  }

  serialize(data: any[], options: JsonMapperCtx) {
    return [].concat(data as any).map(item => options.next(item));
  }
}
