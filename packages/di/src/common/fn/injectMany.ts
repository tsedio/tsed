import type {InvokeOptions} from "../interfaces/InvokeOptions.js";
import {injector} from "./injector.js";
import {localsContainer} from "./localsContainer.js";

/**
 * Injects multiple instances of a given token using the injector service.
 * @param token - The injection token to resolve
 * @param opts - Optional configuration for the injection
 * @param opts.useOpts - Options for instance creation
 * @param opts.rebuild - Whether to rebuild the instance
 * @param opts.locals - Local container overrides
 * @returns Array of resolved instances
 */
export function injectMany<T>(token: string | symbol, opts?: Partial<Pick<InvokeOptions, "useOpts" | "rebuild" | "locals">>): T[] {
  return injector().getMany<T>(token, {...opts, locals: opts?.locals || localsContainer()} as InvokeOptions);
}
