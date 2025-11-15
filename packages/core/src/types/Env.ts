/**
 * Represents the current application runtime environment.
 *
 * Used by Ts.ED to adapt behaviors (logging, error verbosity, defaults, etc.)
 * depending on the environment.
 *
 * @public
 */
export enum Env {
  PROD = "production",
  DEV = "development",
  TEST = "test"
}

/**
 * Compatibility alias. Prefer using `Env` directly.
 *
 * @deprecated Use `Env` directly.
 */
// tslint:disable-next-line: variable-name
export const EnvTypes = Env;
