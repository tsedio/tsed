import {BadRequest} from "@tsed/exceptions";
import {JsonMapper} from "../decorators/jsonMapper";
import {JsonMapperMethods, JsonMapperCtx} from "../interfaces/JsonMapperMethods";

/**
 * Converter component for the `String`, `Number` and `Boolean` Types.
 * @converters
 * @jsonmapper
 * @component
 */
@JsonMapper(String, Number, Boolean)
export class PrimitiveMapper implements JsonMapperMethods {
  deserialize<T>(data: any, ctx: JsonMapperCtx): string | number | boolean | void | null {
    switch (ctx.type) {
      case String:
        return "" + data;

      case Number:
        if ([null, "null"].includes(data)) return null;

        const n = +data;

        if (isNaN(n)) {
          throw new BadRequest("Cast error. Expression value is not a number.");
        }

        return n;

      case Boolean:
        if (["true", "1", true].includes(data)) return true;
        if (["false", "0", false].includes(data)) return false;
        if ([null, "null"].includes(data)) return null;
        if (data === undefined) return undefined;

        return !!data;
    }
  }

  serialize(object: string | number | boolean): string | number | boolean {
    return object;
  }
}
