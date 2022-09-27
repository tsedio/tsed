import {BadRequest} from "@tsed/exceptions";
import {JsonMapper} from "../decorators/jsonMapper";
import {JsonMapperCtx, JsonMapperMethods} from "../interfaces/JsonMapperMethods";

function isNullish(data: any) {
  return [null, "null"].includes(data);
}

/**
 * Mapper for the `String`, `Number`, `BigInt` and `Boolean` types.
 * @jsonmapper
 * @component
 */
@JsonMapper(String, Number, Boolean, BigInt)
export class PrimitiveMapper implements JsonMapperMethods {
  deserialize<T>(data: any, ctx: JsonMapperCtx): string | number | boolean | void | null | BigInt {
    switch (ctx.type) {
      case String:
        return data === null ? null : "" + data;

      case BigInt:
        if (isNullish(data)) return null;

        return BigInt(data);

      case Number:
        if (isNullish(data)) return null;

        const n = +data;

        if (isNaN(n)) {
          throw new BadRequest("Cast error. Expression value is not a number.");
        }

        return n;

      case Boolean:
        if (["true", "1", true].includes(data)) return true;
        if (["false", "0", false].includes(data)) return false;
        if (isNullish(data)) return null;
        if (data === undefined) return undefined;

        return !!data;
    }
  }

  serialize(object: string | number | boolean | BigInt): string | number | boolean | BigInt {
    return object;
  }
}
