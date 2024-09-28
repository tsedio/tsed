import {nameOf} from "@tsed/core";

import {JsonMapper} from "../decorators/jsonMapper.js";
import {JsonMapperCtx, JsonMapperMethods} from "../interfaces/JsonMapperMethods.js";

function isNullish(data: any) {
  return [null, "null"].includes(data);
}

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
    return (this as any)[nameOf(ctx?.type)] && typeof object !== "object" ? (this as any)[nameOf(ctx.type)](object, ctx) : object;
  }

  protected String(data: any) {
    return data === null ? null : "" + data;
  }

  protected Boolean(data: any) {
    if (["true", "1", true].includes(data)) return true;
    if (["false", "0", false].includes(data)) return false;
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
