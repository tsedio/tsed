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

type TemporalCtor = new (...args: any[]) => unknown;

let cachedTemporal: Record<string, unknown> | undefined;
let cachedCtors: TemporalCtor[] = [];

/**
 * Constructors of the global `Temporal` types, resolved once per `Temporal` object
 * (it is set once by the runtime or a polyfill) instead of on each `isTemporal()` call.
 */
function getTemporalCtors(Temporal: Record<string, unknown>): TemporalCtor[] {
  if (cachedTemporal !== Temporal) {
    cachedTemporal = Temporal;
    cachedCtors = TEMPORAL_TYPE_NAMES.map((name) => Temporal[name] as TemporalCtor | undefined).filter(
      (ctor): ctor is TemporalCtor => !!ctor
    );
  }

  return cachedCtors;
}

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

  const ctors = getTemporalCtors(Temporal);

  for (let i = 0; i < ctors.length; i++) {
    const ctor = ctors[i];

    if (target === ctor || target instanceof ctor) {
      return true;
    }
  }

  return false;
}
