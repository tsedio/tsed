import {ProviderType} from "../domain/ProviderType.js";
import {Injectable} from "./injectable.js";

/**
 * The decorators `@Interceptor()` declare a new service can be injected in other service or controller on there `constructor`.
 * All services annotated with `@Interceptor()` are constructed one time.
 *
 * > `@Service()` use the `reflect-metadata` to collect and inject service on controllers or other services.
 *
 * @returns {Function}
 * @decorator
 */
export function Interceptor(): Function {
  return Injectable({
    type: ProviderType.INTERCEPTOR
  });
}
