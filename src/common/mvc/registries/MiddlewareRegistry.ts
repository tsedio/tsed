import {getClassOrSymbol, Registry} from "@tsed/core";
import {Provider} from "../../di/class/Provider";
import {IProvider} from "../../di/interfaces/IProvider";
import {ProviderType} from "../../di/interfaces/ProviderType";
import {GlobalProviders} from "../../di/registries/ProviderRegistry";
import {MiddlewareType} from "../interfaces/MiddlewareType";

/**
 * @deprecated
 * @type {Registry<Provider<any>, Provider>}
 */
export const MiddlewareRegistry = GlobalProviders.createRegistry(ProviderType.MIDDLEWARE, Provider, {
    injectable: true,
    buildable: true
});

const middlewareRegisterFn = GlobalProviders.createRegisterFn(ProviderType.MIDDLEWARE);

/**
 * Add a new middleware in the `ProviderRegistry`. This middleware will be built when `InjectorService` will be loaded.
 *
 * #### Example
 *
 * ```typescript
 * import {registerService, InjectorService} from "@tsed/common";
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
 * InjectorService.load();
 *
 * const myFooService = InjectorService.get<FooMiddleware>(FooMiddleware);
 * fooMiddleware.use(); // test
 * ```
 *
 * @param provider Provider configuration.
 */
export function registerMiddleware(provider: any | IProvider<any>, instance?: any) {
    middlewareRegisterFn(provider, instance);
    GlobalProviders
        .getRegistry(ProviderType.MIDDLEWARE)!
        .get(getClassOrSymbol(provider.provide || provider))!
        .store.set("middlewareType", MiddlewareType.MIDDLEWARE);
}

/**
 * Add a new middleware in the `ProviderRegistry`. This middleware will be built when `InjectorService` will be loaded.
 *
 * #### Example
 *
 * ```typescript
 * import {registerService, InjectorService} from "@tsed/common";
 *
 * export default class FooMiddleware {
 *     constructor(){}
 *     use() {
 *         return "test";
 *     }
 * }
 *
 * registerMiddlewareError({provide: MyFooService});
 * // or
 * registerMiddlewareError(MyFooService);
 *
 * InjectorService.load();
 *
 * const fooMiddleware = InjectorService.get<FooMiddleware>(FooMiddleware);
 * fooMiddleware.use(); // test
 * ```
 *
 * @param provider Provider configuration.
 */
export function registerMiddlewareError(provider: any | IProvider<any>, instance?: any) {
    middlewareRegisterFn(provider, instance);
    GlobalProviders
        .getRegistry(ProviderType.MIDDLEWARE)!
        .get(getClassOrSymbol(provider.provide || provider))!
        .store.set("middlewareType", MiddlewareType.ERROR);
}