import {registerInterceptor} from "../registries/ProviderRegistry";

/**
 * The decorators `@Service()` declare a new service can be injected in other service or controller on there `constructor`.
 * All services annotated with `@Service()` are constructed one time.
 *
 * > `@Service()` use the `reflect-metadata` to collect and inject service on controllers or other services.
 *
 * @returns {Function}
 * @decorator
 */
export function Interceptor(): Function {
  return registerInterceptor;
}
