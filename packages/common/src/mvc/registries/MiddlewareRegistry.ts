import {GlobalProviders, Provider, ProviderType, TypedProvidersRegistry} from "@tsed/di";

/**
 *
 * @type {Registry<Provider<any>, Provider>}
 */
// tslint:disable-next-line: variable-name
export const MiddlewareRegistry: TypedProvidersRegistry = GlobalProviders.createRegistry(ProviderType.MIDDLEWARE, Provider, {
  injectable: true
});
/**
 * Add a new middleware in the `ProviderRegistry`. This middleware will be built when `InjectorService` will be loaded.
 *
 * #### Example
 *
 * ```typescript
 * import {registerMiddleware, InjectorService} from "@tsed/common";
 *
 * export default class FooMiddleware {
 *     constructor(){}
 *     use() {
 *         return "test";
 *     }
 * }
 *
 * registerMiddleware({provide: FooMiddleware});
 * // or
 * registerMiddleware(FooMiddleware);
 *
 * const injector = new InjectorService()
 * injector.load();
 *
 * const myFooService = injector.get<FooMiddleware>(FooMiddleware);
 * fooMiddleware.use(); // test
 * ```
 *
 * @param provider Provider configuration.
 */
export const registerMiddleware = GlobalProviders.createRegisterFn(ProviderType.MIDDLEWARE);
