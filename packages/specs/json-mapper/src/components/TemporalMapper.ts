import {isBoolean} from "@tsed/core";

import {JsonMapper} from "../decorators/jsonMapper.js";
import {JsonMapperCtx, JsonMapperMethods} from "../interfaces/JsonMapperMethods.js";

interface TemporalType {
  from(value: unknown): unknown;
}

/**
 * Older runtimes (e.g. Node < 24) don't expose it, so it may be `undefined` at import time.
 */
const Temporal = (globalThis as unknown as {Temporal?: Record<string, TemporalType>}).Temporal;

/**
 * Temporal types that carry a sub-second time component. These serialize at millisecond precision
 * (`fractionalSecondDigits: 3`) to match the historical `Date#toISOString()` output that JSON
 * consumers expect, instead of leaking nanoseconds. The date-only types (`PlainDate`,
 * `PlainYearMonth`, `PlainMonthDay`) and `Duration` keep their default `toString()`.
 */
const TIME_BEARING_TYPES = Temporal ? [Temporal.Instant, Temporal.ZonedDateTime, Temporal.PlainDateTime, Temporal.PlainTime] : [];

/**
 * Mapper for the `Temporal.*` types (`Instant`, `ZonedDateTime`, `PlainDate`, `PlainDateTime`,
 * `PlainTime`, `PlainYearMonth`, `PlainMonthDay`, `Duration`).
 *
 * Every Temporal type exposes a static `from(string)` factory and an ISO-8601 `toString()`, so a
 * single mapper handles all of them: `serialize()` calls `toString()` (at millisecond precision for
 * the time-bearing types, see {@link TIME_BEARING_TYPES}), and `deserialize()` rebuilds the concrete
 * type read from `ctx.type` (the deserializer sets it to the registered constructor).
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
    if (isBoolean(data) || data === null || data === undefined) {
      return data;
    }

    return (ctx.type as unknown as TemporalType).from(data);
  }

  serialize(object: {toString(options?: {fractionalSecondDigits?: number}): string} | null | undefined): any {
    if (!object) {
      return object;
    }

    if (TIME_BEARING_TYPES.some((type) => object instanceof (type as unknown as abstract new (...args: any[]) => unknown))) {
      return object.toString({fractionalSecondDigits: 3});
    }

    return object.toString();
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
