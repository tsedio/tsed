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

  // plain loop instead of Array.some(): no closure per call. The constructors are read on each
  // call, so a Temporal.* member replaced at runtime is taken into account.
  for (let i = 0; i < TEMPORAL_TYPE_NAMES.length; i++) {
    const ctor = Temporal[TEMPORAL_TYPE_NAMES[i]] as (new (...args: any[]) => unknown) | undefined;

    if (ctor && (target === ctor || target instanceof ctor)) {
      return true;
    }
  }

  return false;
}
