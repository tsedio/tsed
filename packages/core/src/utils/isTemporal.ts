interface TemporalGlobal {
  Temporal?: Record<string, unknown>;
}

/**
 * Names of the `Temporal.*` types that serialize to/from an ISO-8601 string. Kept in sync with
 * the `TemporalMapper` registered by `@tsed/json-mapper`.
 */
const TEMPORAL_TYPE_NAMES = [
  "Instant",
  "ZonedDateTime",
  "PlainDate",
  "PlainDateTime",
  "PlainTime",
  "PlainYearMonth",
  "PlainMonthDay",
  "Duration"
];

/**
 * Checks if a value is a `Temporal.*` constructor (e.g. `Temporal.Instant`) or an instance of one.
 *
 * Like {@link isDate}, these types map to a JSON schema `string`: every `Temporal.*` type exposes a
 * static `from(string)` factory and an ISO-8601 `toString()`. The global `Temporal` object is
 * absent on older runtimes (Node < 24), so the check is guarded and returns `false` there.
 *
 * @public
 * @since v8.34.0
 */
export function isTemporal(target: any): boolean {
  const Temporal = (globalThis as unknown as TemporalGlobal).Temporal;

  if (!target || !Temporal) {
    return false;
  }

  return TEMPORAL_TYPE_NAMES.some((name) => {
    const ctor = Temporal[name] as (new (...args: any[]) => unknown) | undefined;

    return !!ctor && (target === ctor || target instanceof ctor);
  });
}
