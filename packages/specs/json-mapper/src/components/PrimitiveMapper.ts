import {JsonMapperCtx, JsonMapperMethods} from "../interfaces/JsonMapperMethods.js";
import {JsonMapper} from "../decorators/jsonMapper.js";
import {nameOf} from "@tsed/core";

function isNullish(data: any) {
  return data === null || data === "null";
}

/**
 * Error thrown when a primitive conversion cannot be performed safely.
 */
export class CastError extends Error {
  name = "CAST_ERROR";

  constructor(message: string) {
    super(`Cast error. ${message}`);
  }
}

/**
 * Mapper for the `String`, `Number`, `BigInt` and `Boolean` types.
 * @jsonmapper
 * @component
 */
@JsonMapper(String, Number, Boolean, BigInt)
export class PrimitiveMapper implements JsonMapperMethods {
  deserialize<T>(data: any, ctx: JsonMapperCtx): string | number | boolean | void | null | BigInt {
    return (this as any)[nameOf(ctx.type)] ? (this as any)[nameOf(ctx.type)](data, ctx) : undefined;
  }

  serialize(object: string | number | boolean | BigInt, ctx: JsonMapperCtx): string | number | boolean | BigInt {
    const name = nameOf(ctx?.type);

    // inline typeof on purpose: hot path for every primitive value, cheaper than calling isObject()
    return (this as any)[name] && typeof object !== "object" ? (this as any)[name](object, ctx) : object;
  }

  protected String(data: any) {
    return data === null ? null : "" + data;
  }

  protected Boolean(data: any) {
    if (data === "true" || data === "1" || data === true) return true;
    if (data === "false" || data === "0" || data === false) return false;
    if (isNullish(data)) return null;
    if (data === undefined) return undefined;

    return !!data;
  }

  protected Number(data: any) {
    if (isNullish(data)) return null;
    if (data === undefined) return data;

    const n = +data;

    if (isNaN(n)) {
      throw new CastError("Expression value is not a number.");
    }

    return n;
  }

  protected BigInt(data: any) {
    if (isNullish(data)) return null;

    return BigInt(data);
  }
}
