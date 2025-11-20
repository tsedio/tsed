import type {InvokeOptions} from "../interfaces/InvokeOptions.js";
import type {TokenProvider} from "../interfaces/TokenProvider.js";
import {injector} from "./injector.js";
import {invokeOptions, localsContainer} from "./localsContainer.js";

/**
 * Programmatically inject a provider instance.
 *
 * Resolves and returns a provider instance using the global injector.
 * Useful for injecting dependencies outside of decorators or in property initializers.
 *
 * ### Usage
 *
 * ```typescript
 * import {inject, Injectable} from "@tsed/di";
 *
 * @Injectable()
 * export class MyService {
 *   // Property injection
 *   connection = inject(CONNECTION);
 *
 *   // Function injection
 *   getData() {
 *     const api = inject(ApiService);
 *     return api.fetch();
 *   }
 * }
 * ```
 *
 * @typeParam TokenType The type of the injected provider
 * @param token The provider token to resolve
 * @param opts Optional invocation options (locals, rebuild, useOpts)
 * @returns The resolved provider instance
 * @public
 */
export function inject<TokenType>(
  token: TokenProvider<TokenType>,
  opts?: Partial<Pick<InvokeOptions, "useOpts" | "rebuild" | "locals">>
): TokenType {
  return injector().resolve(token, {
    ...opts,
    ...invokeOptions(),
    locals: opts?.locals || localsContainer()
  });
}
