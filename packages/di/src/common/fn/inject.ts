import type {InvokeOptions} from "../interfaces/InvokeOptions.js";
import type {TokenProvider} from "../interfaces/TokenProvider.js";
import {injector} from "./injector.js";
import {invokeOptions, localsContainer} from "./localsContainer.js";

/**
 * Inject a provider to another provider.
 *
 * Use this function to inject a custom provider on constructor parameter or property.
 *
 * ```typescript
 * @Injectable()
 * export class MyService {
 *   connection = inject(CONNECTION);
 * }
 * ```
 *
 * @param token A token provider or token provider group
 * @param opts
 * @returns {Function}
 * @decorator
 */
export function inject<T>(token: TokenProvider<T>, opts?: Partial<Pick<InvokeOptions, "useOpts" | "rebuild" | "locals">>): T {
  return injector().resolve(token, {
    ...opts,
    ...invokeOptions(),
    locals: opts?.locals || localsContainer()
  });
}
