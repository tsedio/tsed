import {deepClone, getClass, getClassOrSymbol, Metadata, nameOf, prototypeOf, RegistryKey, Store, Type} from "@tsed/core";
import {Provider} from "../class/Provider";
import {InjectionError} from "../errors/InjectionError";
import {InjectionScopeError} from "../errors/InjectionScopeError";
import {
  IDILogger,
  IDISettings,
  IInjectableMethod,
  IInjectableProperties,
  IInjectablePropertyService,
  IInjectablePropertyValue,
  IInterceptor,
  IInterceptorContext,
  InjectablePropertyType,
  ProviderScope,
  ProviderType,
  TokenProvider
} from "../interfaces";
import {GlobalProviders} from "../registries/GlobalProviders";
import {registerFactory} from "../registries/ProviderRegistry";

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
 * const injector = new InjectorService()
 * injector.load();
 *
 * const myService1 = injector.get<MyService1>(MyServcice1);
 * ```
 *
 * > Note: `ServerLoader` make this automatically when you use `ServerLoader.mount()` method (or settings attributes) and load services and controllers during the starting server.
 *
 */
export class InjectorService extends Map<TokenProvider, Provider<any>> {
  public settings: IDISettings = new Map();
  public logger: IDILogger = console;
  public scopes: {[key: string]: ProviderScope} = {};

  constructor() {
    super();
    this.forkProvider(InjectorService, this);
  }

  scopeOf(providerType: ProviderType) {
    return this.scopes[providerType] || ProviderScope.SINGLETON;
  }

  /**
   * The getProvider() method returns a specified element from a Map object.
   * @returns {T} Returns the element associated with the specified key or undefined if the key can't be found in the Map object.
   * @param token
   */
  public getProvider(token: TokenProvider): Provider<any> | undefined {
    return super.get(getClassOrSymbol(token));
  }

  /**
   * Clone a provider from GlobalProviders and the given token. forkProvider method build automatically the provider if the instance parameter ins't given.
   * @param token
   * @param instance
   */
  public forkProvider(token: TokenProvider, instance?: any): Provider<any> {
    const provider = GlobalProviders.get(token)!.clone();
    this.set(token, provider);

    provider.instance = instance;

    return provider;
  }

  /**
   *
   * @param {ProviderType} type
   * @returns {[RegistryKey , Provider<any>][]}
   */
  getProviders(type?: ProviderType | string): Provider<any>[] {
    return Array.from(this)
      .filter(([key, provider]) => (type ? provider.type === type : true))
      .map(([key, provider]) => provider);
  }

  /**
   * Return a list of instance build by the injector.
   */
  public toArray(): any[] {
    return Array.from(this.values()).map(provider => provider.instance);
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
   * @param token The class or symbol registered in InjectorService.
   * @returns {boolean}
   */
  get<T>(token: TokenProvider): T | undefined {
    return (super.has(token) && super.get(getClassOrSymbol(token))!.instance) || undefined;
  }

  /**
   * The has() method returns a boolean indicating whether an element with the specified key exists or not.
   * @param key
   * @returns {boolean}
   * @param token
   */
  has(token: TokenProvider): boolean {
    return super.has(getClassOrSymbol(token)) && !!this.get(token);
  }

  async destroy() {
    await this.emit("$onDestroy");
    this.clear();
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
   * @param token The injectable class to invoke. Class parameters are injected according constructor signature.
   * @param locals  Optional object. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted.
   * @param designParamTypes Optional object. List of injectable types.
   * @param requiredScope
   * @returns {T} The class constructed.
   */
  invoke<T>(
    token: TokenProvider,
    locals: Map<string | Function, any> = new Map(),
    designParamTypes?: any[],
    requiredScope: boolean = false
  ): T {
    const {onInvoke} = GlobalProviders.getRegistrySettings(token);
    const provider = this.getProvider(token);
    const parentScope = Store.from(token).get("scope");

    if (!designParamTypes) {
      designParamTypes = Metadata.getParamTypes(token);
    }

    if (provider && onInvoke) {
      onInvoke(provider, locals, designParamTypes);
    }

    const services = designParamTypes.map(serviceType =>
      this.mapServices({
        serviceType,
        target: token,
        locals,
        requiredScope,
        parentScope
      })
    );

    const instance = new token(...services);

    this.bindInjectableProperties(instance);

    return instance;
  }

  /**
   * Build all providers from GlobalProviders or from given providers parameters and emit `$onInit` event.
   *
   * @param container
   */
  async load(): Promise<any> {
    // TODO copy all provider from GlobalProvider registry. In future this action will be performed from Bootstrap class
    GlobalProviders.forEach((p, k) => {
      if (!this.has(k)) {
        this.set(k, p.clone());
      }
    });

    this.build();

    return Promise.all([this.emit("$onInit")]);
  }

  /**
   *
   * @param instance
   */
  public bindInjectableProperties(instance: any) {
    const store = Store.from(getClass(instance));

    if (store && store.has("injectableProperties")) {
      const properties: IInjectableProperties = store.get("injectableProperties") || [];

      Object.keys(properties)
        .map(key => properties[key])
        .forEach(definition => {
          switch (definition.bindingType) {
            case InjectablePropertyType.METHOD:
              this.bindMethod(instance, definition);
              break;
            case InjectablePropertyType.PROPERTY:
              this.bindProperty(instance, definition);
              break;
            case InjectablePropertyType.CONSTANT:
              this.bindConstant(instance, definition);
              break;
            case InjectablePropertyType.VALUE:
              this.bindValue(instance, definition);
              break;
            case InjectablePropertyType.INTERCEPTOR:
              this.bindInterceptor(instance, definition);
              break;
          }
        });
    }
  }

  /**
   *
   * @param instance
   * @param {string} propertyKey
   */
  public bindMethod(instance: any, {propertyKey}: IInjectablePropertyService) {
    const target = getClass(instance);
    const originalMethod = instance[propertyKey];
    const deps = Metadata.getParamTypes(prototypeOf(target), propertyKey);

    instance[propertyKey] = () => {
      const services = deps.map((dependency: any) => this.get(dependency));

      return originalMethod.call(instance, ...services);
    };
  }

  /**
   *
   * @param instance
   * @param {string} propertyKey
   * @param {any} useType
   */
  public bindProperty(instance: any, {propertyKey, useType}: IInjectablePropertyService) {
    Object.defineProperty(instance, propertyKey, {
      get: () => {
        return this.get(useType);
      }
    });
  }

  /**
   *
   * @param instance
   * @param {string} propertyKey
   * @param {any} useType
   */
  public bindValue(instance: any, {propertyKey, expression, defaultValue}: IInjectablePropertyValue) {
    const descriptor = {
      get: () => this.settings.get(expression) || defaultValue,
      set: (value: any) => this.settings.set(expression, value),
      enumerable: true,
      configurable: true
    };
    Object.defineProperty(instance, propertyKey, descriptor);
  }

  /**
   *
   * @param instance
   * @param {string} propertyKey
   * @param {any} useType
   */
  public bindConstant(instance: any, {propertyKey, expression, defaultValue}: IInjectablePropertyValue) {
    const clone = (o: any) => {
      if (o) {
        return Object.freeze(deepClone(o));
      }

      return defaultValue;
    };

    const descriptor = {
      get: () => clone(this.settings.get(expression)),

      enumerable: true,
      configurable: true
    };
    Object.defineProperty(instance, propertyKey, descriptor);

    return descriptor;
  }

  /**
   *
   * @param instance
   * @param propertyKey
   * @param useType
   * @param options
   */
  public bindInterceptor(instance: any, {propertyKey, useType, options}: IInjectablePropertyService) {
    const target = getClass(instance);
    const originalMethod = instance[propertyKey];

    instance[propertyKey] = (...args: any[]) => {
      const context: IInterceptorContext<any> = {
        target,
        method: propertyKey,
        propertyKey,
        args,
        proceed(err?: Error) {
          if (!err) {
            return originalMethod.apply(instance, args);
          }

          throw err;
        }
      };

      return this.get<IInterceptor>(useType)!.aroundInvoke(context, options);
    };
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
   * @deprecated
   */
  public invokeMethod(handler: any, options: IInjectableMethod<any>): any {
    let {designParamTypes} = options;
    const {locals = new Map<any, any>(), target, methodName} = options;

    if (handler.$injected) {
      return handler.call(target, locals);
    }

    if (!designParamTypes) {
      designParamTypes = Metadata.getParamTypes(prototypeOf(target), methodName);
    }

    const services = designParamTypes.map((serviceType: any) =>
      this.mapServices({
        serviceType,
        target,
        locals,
        requiredScope: false,
        parentScope: false
      })
    );

    return handler(...services);
  }

  /**
   * Emit an event to all service. See service [lifecycle hooks](/docs/services.md#lifecycle-hooks).
   * @param eventName The event name to emit at all services.
   * @param args List of the parameters to give to each services.
   * @returns {Promise<any[]>} A list of promises.
   */
  public async emit(eventName: string, ...args: any[]) {
    this.logger.debug("\x1B[1mCall hook", eventName, "\x1B[22m");

    const providers = this.getProviders();

    for (const provider of providers) {
      const service = provider.instance;

      if (service && eventName in service) {
        const startTime = new Date().getTime();
        this.logger.debug(`Call ${nameOf(provider.provide)}.${eventName}()`);

        await service[eventName](...args);

        this.logger.debug(`Run ${nameOf(provider.provide)}.${eventName}() in ${new Date().getTime() - startTime} ms`);
      }
    }
  }

  /**
   *
   * @returns {any}
   * @param options
   */
  private mapServices(options: any) {
    const {serviceType, target, locals, parentScope, requiredScope} = options;
    const serviceName = typeof serviceType === "function" ? nameOf(serviceType) : serviceType;
    const localService = locals.get(serviceName) || locals.get(serviceType);

    if (localService) {
      return localService;
    }

    const provider = this.getProvider(serviceType);

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
      locals.set(provider.provide, instance);

      return instance;
    } catch (er) {
      const error = new InjectionError(target, serviceName.toString(), "injection failed");
      (error as any).origin = er;
      throw error;
    }
  }

  /**
   *
   * @returns {Map<Type<any>, any>}
   */
  private build(): Map<Type<any>, any> {
    const locals: Map<Type<any>, any> = new Map();

    this.forEach(provider => {
      const token = nameOf(provider.provide);
      const settings = GlobalProviders.getRegistrySettings(provider.type);
      const useClass = nameOf(provider.useClass);

      if (settings.buildable) {
        const defaultScope: ProviderScope = this.scopeOf(provider.type);

        if (defaultScope && !provider.scope) {
          provider.scope = defaultScope;
        }

        if (!locals.has(provider.provide)) {
          provider.instance = this.invoke(provider.useClass, locals);
        } else if (provider.scope === ProviderScope.SINGLETON) {
          provider.instance = locals.get(provider.provide);
        }

        this.logger.debug(nameOf(provider.provide), "built", token === useClass ? "" : `from class ${useClass}`);
      } else {
        provider.scope = ProviderScope.SINGLETON;
        this.logger.debug(nameOf(provider.provide), "loaded");
      }

      if (provider.instance) {
        locals.set(provider.provide, provider.instance);
      }
    });

    return locals;
  }
}

/**
 * Create the first service InjectorService
 */
registerFactory(InjectorService);
