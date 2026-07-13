import {isBoolean} from "@tsed/core";

import {JsonMapper} from "../decorators/jsonMapper.js";
import {JsonMapperCtx, JsonMapperMethods} from "../interfaces/JsonMapperMethods.js";

interface TemporalType {
  from(value: unknown): unknown;
}

/**
 * Access the global `Temporal` object without depending on the `esnext.temporal` TypeScript lib.
 * Older runtimes (e.g. Node < 24) don't expose it, so it may be `undefined` at import time.
 */
const Temporal = (globalThis as unknown as {Temporal?: Record<string, TemporalType>}).Temporal;

/**
 * Mapper for the `Temporal.*` types (`Instant`, `ZonedDateTime`, `PlainDate`, `PlainDateTime`,
 * `PlainTime`, `PlainYearMonth`, `PlainMonthDay`, `Duration`).
 *
 * Every Temporal type exposes a static `from(string)` factory and an ISO-8601 `toString()`, so a
 * single mapper handles all of them: `serialize()` calls `toString()`, and `deserialize()` rebuilds
 * the concrete type read from `ctx.type` (the deserializer sets it to the registered constructor).
 *
 * Registration is guarded by a runtime `Temporal` check so importing `@tsed/json-mapper` stays safe
 * on runtimes that don't expose the global `Temporal` object.
 *
 * @jsonmapper
 * @component
 */
export class TemporalMapper implements JsonMapperMethods {
  deserialize(data: string | number, ctx: JsonMapperCtx): unknown;
  deserialize(data: boolean | null | undefined, ctx: JsonMapperCtx): boolean | null | undefined;
  deserialize(data: any, ctx: JsonMapperCtx): any {
    // don't convert unexpected data. In normal case, Ajv reject unexpected data.
    // But by default, we have to skip data deserialization and let user to apply
    // the right mapping
    if (isBoolean(data) || data === null || data === undefined) {
      return data;
    }

    return (ctx.type as unknown as TemporalType).from(data);
  }

  serialize(object: {toString(): string} | null | undefined): any {
    return object ? object.toString() : object;
  }
}

if (Temporal) {
  JsonMapper(
    Temporal.Instant,
    Temporal.ZonedDateTime,
    Temporal.PlainDate,
    Temporal.PlainDateTime,
    Temporal.PlainTime,
    Temporal.PlainYearMonth,
    Temporal.PlainMonthDay,
    Temporal.Duration
  )(TemporalMapper);
}
