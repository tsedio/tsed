import {Deprecated, Env, Metadata, nameOf, promiseTimeout, ProxyRegistry, Store, Type} from "@tsed/core";
import {$log} from "ts-log-debug";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";
import {Provider} from "../class/Provider";
import {InjectionError} from "../errors/InjectionError";
import {InjectionScopeError} from "../errors/InjectionScopeError";
import {IInjectableMethod, IProvider, ProviderScope} from "../interfaces";
import {
    GlobalProviders,
    ProviderRegistry,
    registerFactory,
    registerProvider,
    registerService
} from "../registries/ProviderRegistry";

/**
 * This service contain all services collected by `@Service` or services declared manually with `InjectorService.factory()` or `InjectorService.service()`.
 *
 * ### Example:
 *
 * ```typescript
 * import {InjectorService} from "@tsed/common";
 *
 * // Import the services (all services are decorated with @Service()";
 * import MyService1 from "./services/service1";
 * import MyService2 from "./services/service2";
 * import MyService3 from "./services/service3";
 *
 * // When all services is imported you can load InjectorService.
 * InjectorService.load();
 *
 * const myService1 = InjectorService.get<MyService1>(MyServcice1);
 * ```
 *
 * > Note: `ServerLoader` make this automatically when you use `ServerLoader.mount()` method (or settings attributes) and load services and controllers during the starting server.
 *
 */
export class InjectorService extends ProxyRegistry<Provider<any>, IProvider<any>> {

    constructor() {
        super(ProviderRegistry);
    }

    /**
     * Invoke the class and inject all services that required by the class constructor.
     *
     * #### Example
     *
     * ```typescript
     * import {InjectorService} from "@tsed/common";
     * import MyService from "./services";
     *
     * class OtherService {
     *     constructor(injectorService: InjectorService) {
     *          const myService = injectorService.invoke<MyService>(MyService);
     *      }
     *  }
     * ```
     *
     * @param target The injectable class to invoke. Class parameters are injected according constructor signature.
     * @param locals  Optional object. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted.
     * @param designParamTypes Optional object. List of injectable types.
     * @returns {T} The class constructed.
     */
    public invoke<T>(target: any, locals: Map<Function, any> = new Map<Function, any>(), designParamTypes?: any[], requiredScope: boolean = false): T {
        return InjectorService.invoke<T>(target, locals, designParamTypes, requiredScope);
    }

    /**
     * Invoke a class method and inject service.
     *
     * #### IInjectableMethod options
     *
     * * **target**: Optional. The class instance.
     * * **methodName**: `string` Optional. The method name.
     * * **designParamTypes**: `any[]` Optional. List of injectable types.
     * * **locals**: `Map<Function, any>` Optional. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted.
     *
     * #### Example
     *
     * ```typescript
     * import {InjectorService} from "@tsed/common";
     *
     * class MyService {
     *      constructor(injectorService: InjectorService) {
     *          injectorService.invokeMethod(this.method, {
     *              this,
     *              methodName: 'method'
     *          });
     *      }
     *
     *   method(otherService: OtherService) {}
     * }
     * ```
     *
     * @returns {any}
     * @param handler The injectable method to invoke. Method parameters are injected according method signature.
     * @param options Object to configure the invocation.
     */
    public invokeMethod(handler: any, options: IInjectableMethod<any> | any[]): any {
        return InjectorService.invokeMethod(handler, options);
    }

    /**
     * Get a service or factory already constructed from his symbol or class.
     *
     * #### Example
     *
     * ```typescript
     * import {InjectorService} from "@tsed/common";
     * import MyService from "./services";
     *
     * class OtherService {
     *      constructor(injectorService: InjectorService) {
     *          const myService = injectorService.get<MyService>(MyService);
     *      }
     * }
     * ```
     *
     * @param target The class or symbol registered in InjectorService.
     * @returns {boolean}
     */
    static get = <T>(target: any): T =>
        ProviderRegistry.get(target)!.instance;

    /**
     * Invoke a class method and inject service.
     *
     * #### IInjectableMethod options
     *
     * * **target**: Optional. The class instance.
     * * **methodName**: `string` Optional. The method name.
     * * **designParamTypes**: `any[]` Optional. List of injectable types.
     * * **locals**: `Map<Function, any>` Optional. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted.
     *
     * #### Example
     *
     * ```typescript
     * import {InjectorService} from "@tsed/common";
     *
     * class MyService {
     *      constructor(injectorService: InjectorService) {
     *          injectorService.invokeMethod(this.method, {
     *              this,
     *              methodName: 'method'
     *          });
     *      }
     *
     *   method(otherService: OtherService) {}
     * }
     * ```
     *
     * @returns {any}
     * @param handler The injectable method to invoke. Method parameters are injected according method signature.
     * @param options Object to configure the invocation.
     */
    static invokeMethod(handler: any, options: IInjectableMethod<any> | any[]) {

        let designParamTypes, target, methodName;
        let locals: Map<any, any> = new Map<any, any>();

        if (options instanceof Array) {
            designParamTypes = options as Array<any>;
        } else {
            designParamTypes = options.designParamTypes;
            target = options.target;
            methodName = options.methodName;

            if (options.locals) {
                locals = options.locals;
            }
        }

        /* istanbul ignore next */
        if (locals instanceof Map === false) {
            locals = new Map();
        }

        if (handler.$injected) {
            return handler.call(target, locals);
        }

        if (!designParamTypes) {
            designParamTypes = Metadata.getParamTypes(target, methodName);
        }

        const services = designParamTypes
            .map((serviceType: any) => {

                const serviceName = typeof serviceType === "function" ? nameOf(serviceType) : serviceType;

                /* istanbul ignore next */
                if (locals.has(serviceName)) {
                    return locals.get(serviceName);
                }

                if (locals.has(serviceType)) {
                    return locals.get(serviceType);
                }

                /* istanbul ignore next */
                if (!this.has(serviceType)) {
                    return undefined;
                }

                return this.get(serviceType);

            });

        return handler(...services);
    }

    /**
     * Initialize injectorService and load all services/factories.
     */
    async load(): Promise<any> {
        return InjectorService.load();
    }

    /**
     * Invoke the class and inject all services that required by the class constructor.
     *
     * #### Example
     *
     * ```typescript
     * import {InjectorService} from "@tsed/common";
     * import MyService from "./services";
     *
     * class OtherService {
     *     constructor(injectorService: InjectorService) {
     *          const myService = injectorService.invoke<MyService>(MyService);
     *      }
     *  }
     * ```
     *
     * @param target The injectable class to invoke. Class parameters are injected according constructor signature.
     * @param locals  Optional object. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted.
     * @param designParamTypes Optional object. List of injectable types.
     * @param requiredScope
     * @returns {T} The class constructed.
     */
    static invoke<T>(target: any, locals: Map<string | Function, any> = new Map<Function, any>(), designParamTypes?: any[], requiredScope: boolean = false): T {
        const {onInvoke} = GlobalProviders.getRegistrySettings(target);
        const provider = GlobalProviders.get(target);
        const parentScope = Store.from(target).get("scope");

        if (!designParamTypes) {
            designParamTypes = Metadata.getParamTypes(target);
        }

        if (provider && onInvoke) {
            onInvoke(provider, locals, designParamTypes);
        }

        const services = designParamTypes
            .map((serviceType) =>
                this.mapServices({
                    serviceType,
                    target,
                    locals,
                    requiredScope,
                    parentScope
                })
            );

        return new target(...services);
    }

    /**
     *
     * @returns {any}
     * @param options
     */
    private static mapServices(options: any) {
        const {serviceType, target, locals, parentScope, requiredScope} = options;
        const serviceName = typeof serviceType === "function" ? nameOf(serviceType) : serviceType;
        const localService = locals.get(serviceName) || locals.get(serviceType);

        if (localService) {
            return localService;
        }

        const provider = GlobalProviders.get(serviceType);

        if (!provider) {
            throw new InjectionError(target, serviceName.toString());
        }

        const {buildable, injectable} = GlobalProviders.getRegistrySettings(provider.type);
        const scopeReq = provider.scope === ProviderScope.REQUEST;

        if (!injectable) {
            throw new InjectionError(target, serviceName.toString(), "not injectable");
        }

        if (!buildable || (provider.instance && !scopeReq)) {
            return provider.instance;
        }

        if (scopeReq && requiredScope && !parentScope) {
            throw new InjectionScopeError(provider.useClass, target);
        }

        try {
            const instance = this.invoke<any>(provider.useClass, locals, undefined, requiredScope);

            if (!scopeReq) {
                locals.set(provider.provide, instance);
            }
            return instance;
        } catch (er) {
            const error = new InjectionError(target, serviceName.toString(), "injection failed");
            (error as any).origin = er;
            throw error;
        }
    }

    /**
     * Construct the service with his dependencies.
     * @param target The service to be built.
     * @deprecated
     */
    @Deprecated("removed feature")
    static construct<T>(target: Type<any> | symbol): T {
        const provider: Provider<any> = ProviderRegistry.get(target)!;
        return this.invoke<any>(provider.useClass);
    }

    /**
     * Emit an event to all service. See service [lifecycle hooks](docs/services/lifecycle-hooks.md).
     * @param eventName The event name to emit at all services.
     * @param args List of the parameters to give to each services.
     * @returns {Promise<any[]>} A list of promises.
     */
    static async emit(eventName: string, ...args: any[]): Promise<any> {
        const promises: Promise<any>[] = [];

        $log.debug("\x1B[1mCall hook", eventName, "\x1B[22m");

        GlobalProviders.forEach((provider) => {
            const service = provider.instance;

            if (service && eventName in service) {
                /* istanbul ignore next */
                if (eventName === "$onInjectorReady") {
                    $log.warn("$onInjectorReady hook is deprecated, use $onInit hook insteadof. See https://goo.gl/KhvkVy");
                }

                const promise: any = service[eventName](...args);

                /* istanbul ignore next */
                if (promise && promise.then) {
                    promises.push(
                        promiseTimeout(promise, 1000)
                            .then((result) => InjectorService.checkPromiseStatus(eventName, result, nameOf(provider.useClass)))
                    );
                }
            }
        });

        /* istanbul ignore next */
        if (promises.length) {
            $log.debug("\x1B[1mCall hook", eventName, " promises built\x1B[22m");

            return promiseTimeout(Promise.all(promises), 2000)
                .then((result) => InjectorService.checkPromiseStatus(eventName, result));
        }

        return Promise.resolve();
    }

    /**
     *
     * @param {string} eventName
     * @param result
     * @param {string} service
     */

    /* istanbul ignore next */
    private static checkPromiseStatus(eventName: string, result: any, service?: string) {
        if (!result.ok) {
            const msg = `Timeout on ${eventName} hook. Promise are unfulfilled ${service ? "on service" + service : ""}`;
            if (process.env.NODE_ENV === Env.PROD) {
                throw(msg);
            } else {
                setTimeout(() => $log.warn(msg, "In production, the warning will down the server!"), 1000);
            }
        }
    }

    /**
     * Set a new provider from providerSetting.
     * @param provider provide token.
     * @param instance Instance
     * @deprecated Use registerProvider or registerService or registerFactory instead of
     */
    @Deprecated("Use registerService(), registerFactory() or registerProvider() util instead of")
    static set(provider: IProvider<any> | any, instance?: any) {
        if (!provider.provide) {
            provider = {
                provide: provider,
                type: "factory",
                useClass: provider,
                instance: instance || provider
            };
        }

        registerProvider(provider);

        return InjectorService;
    }

    /**
     * Get a service or factory already constructed from his symbol or class.
     *
     * #### Example
     *
     * ```typescript
     * import {InjectorService} from "@tsed/common";
     * import MyService from "./services";
     *
     * class OtherService {
     *      constructor(injectorService: InjectorService) {
     *          const myService = injectorService.get<MyService>(MyService);
     *      }
     * }
     * ```
     *
     * @param target The class or symbol registered in InjectorService.
     * @returns {boolean}
     */
    public get<T>(target: Type<T> | symbol): T {
        return super.get(target)!.instance;
    }

    /**
     * Check if the service of factory exists in `InjectorService`.
     *
     * #### Example
     *
     * ```typescript
     * import {InjectorService} from "@tsed/common";
     * import MyService from "./services";
     *
     * class OtherService {
     *    constructor(injectorService: InjectorService) {
     *        const exists = injectorService.has(MyService); // true or false
     *    }
     * }
     * ```
     *
     * @param target The service class
     * @returns {boolean}
     */
    static has = (target: any): boolean =>
        ProviderRegistry.has(target);

    /**
     * Initialize injectorService and load all services/factories.
     */
    static async load() {

        // containers
        const container = new Map();
        const config = this.get<ServerSettingsService>(ServerSettingsService);
        GlobalProviders.forEach((p, k) => container.set(k, p));

        this.build(container, config);
        $log.debug("\x1B[1mProvider registry built\x1B[22m");

        return Promise.all([
            this.emit("$onInit")
        ]);
    }

    /**
     *
     */
    static build(container: Map<Type<any>, Provider<any>>, config: ServerSettingsService): Map<Type<any>, any> {
        const locals: Map<Type<any>, any> = new Map();

        container
            .forEach((provider) => {
                const token = nameOf(provider.provide);
                const settings = GlobalProviders.getRegistrySettings(provider.type);
                const useClass = nameOf(provider.useClass);

                if (settings.buildable) {
                    const defaultScope: ProviderScope = config.get(`${provider.type}Scope`) || ProviderScope.SINGLETON;

                    if (defaultScope && !provider.scope) {
                        provider.scope = defaultScope;
                    }

                    if (!locals.has(provider.provide)) {
                        provider.instance = this.invoke(provider.useClass, locals);
                        $log.debug(nameOf(provider.provide), "built", token === useClass ? "" : `from class ${useClass}`);
                    }
                } else {
                    provider.scope = ProviderScope.SINGLETON;
                    $log.debug(nameOf(provider.provide), "loaded");
                }

                locals.set(provider.provide, provider.instance);
            });

        return locals;
    }

    /**
     * Emit an event to all service. See service [lifecycle hooks](docs/services/lifecycle-hooks.md).
     * @param eventName The event name to emit at all services.
     * @param args List of the parameters to give to each services.
     * @returns {Promise<any[]>} A list of promises.
     */
    public emit(eventName: string, ...args: any[]) {
        return InjectorService.emit(eventName, ...args);
    }

    /**
     * Add a new service in the registry. This service will be constructed when `InjectorService`will loaded.
     *
     * #### Example
     *
     * ```typescript
     * import {InjectorService} from "@tsed/common";
     *
     * export default class MyFooService {
     *     constructor(){}
     *     getFoo() {
     *         return "test";
     *     }
     * }
     *
     * InjectorService.service(MyFooService);
     * InjectorService.load();
     *
     * const myFooService = InjectorService.get<MyFooService>(MyFooService);
     * myFooService.getFoo(); // test
     * ```
     *
     * @param target The class to add in registry.
     * @deprecated Use registerService or registerFactory instead of.
     */
    @Deprecated("Use registerService() util instead of")
    static service(target: any) {
        return registerService(target);
    }

    /**
     * Add a new factory in `InjectorService` registry.
     *
     * #### Example with symbol definition
     *
     *
     * ```typescript
     * import {InjectorService} from "@tsed/common";
     *
     * export interface IMyFooFactory {
     *    getFoo(): string;
     * }
     *
     * export type MyFooFactory = IMyFooFactory;
     * export const MyFooFactory = Symbol("MyFooFactory");
     *
     * InjectorService.factory(MyFooFactory, {
     *      getFoo:  () => "test"
     * });
     *
     * @Service()
     * export class OtherService {
     *      constructor(@Inject(MyFooFactory) myFooFactory: MyFooFactory){
     *          console.log(myFooFactory.getFoo()); /// "test"
     *      }
     * }
     * ```
     *
     * > Note: When you use the factory method with Symbol definition, you must use the `@Inject()`
     * decorator to retrieve your factory in another Service. Advice: By convention all factory class name will be prefixed by
     * `Factory`.
     *
     * #### Example with class
     *
     * ```typescript
     * import {InjectorService} from "@tsed/common";
     *
     * export class MyFooService {
     *  constructor(){}
     *      getFoo() {
     *          return "test";
     *      }
     * }
     *
     * InjectorService.factory(MyFooService, new MyFooService());
     *
     * @Service()
     * export class OtherService {
     *      constructor(myFooService: MyFooService){
     *          console.log(myFooFactory.getFoo()); /// "test"
     *      }
     * }
     * ```
     * @deprecated Use registerFactory instead of
     */
    @Deprecated("Use registerFactory() util instead of")
    static factory(target: any, instance: any) {
        return registerFactory(target, instance);
    }

}

/**
 * Create the first service InjectorService
 */
registerFactory({provide: InjectorService, instance: new InjectorService()});
