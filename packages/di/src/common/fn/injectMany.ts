import type {InvokeOptions} from "../interfaces/InvokeOptions.js";
import {injector} from "./injector.js";
import {localsContainer} from "./localsContainer.js";

/**
 * Inject all providers matching a given token type.
 *
 * Resolves multiple provider instances that share the same type or group token.
 * Useful for getting all providers of a specific category (e.g., all controllers, all middleware).
 *
 * ### Usage
 *
 * ```typescript
 * import {injectMany, ProviderType} from "@tsed/di";
 *
 * // Get all controllers
 * const controllers = injectMany(ProviderType.CONTROLLER);
 *
 * // Get all providers of a custom type
 * const plugins = injectMany(Symbol.for("PLUGIN"));
 * ```
 *
 * @typeParam T The type of instances to return
 * @param token The injection token or type to resolve
 * @param opts Optional invocation options
 * @param opts.useOpts Options passed to instance creation
 * @param opts.rebuild Whether to rebuild instances
 * @param opts.locals Local container overrides
 * @returns Array of resolved instances
 * @public
 */
export function injectMany<T>(token: string | symbol, opts?: Partial<Pick<InvokeOptions, "useOpts" | "rebuild" | "locals">>): T[] {
  return injector().getMany<T>(token, {...opts, locals: opts?.locals || localsContainer()} as InvokeOptions);
}
