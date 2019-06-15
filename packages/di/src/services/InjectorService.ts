import {deepClone, getClass, getClassOrSymbol, isFunction, Metadata, nameOf, prototypeOf, Store} from "@tsed/core";
import * as util from "util";
import {Container} from "../class/Container";
import {LocalsContainer} from "../class/LocalsContainer";
import {Provider} from "../class/Provider";
import {Injectable} from "../decorators/injectable";
import {InjectionError} from "../errors/InjectionError";
import {UndefinedTokenError} from "../errors/UndefinedTokenError";
import {
  IDILogger,
  IDISettings,
  IInjectableProperties,
  IInjectablePropertyService,
  IInjectablePropertyValue,
  IInterceptor,
  IInterceptorContext,
  IInvokeOptions,
  InjectablePropertyType,
  ProviderScope,
  TokenProvider
} from "../interfaces";
import {GlobalProviders} from "../registries/GlobalProviders";

interface IInvokeSettings {
  token: TokenProvider;
  parent?: TokenProvider;
  scope: ProviderScope;
  useScope: boolean;
  isBindable: boolean;
  deps: any[];

  construct(deps: TokenProvider[]): any;
}

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
@Injectable({
  scope: ProviderScope.SINGLETON,
  global: true
})
export class InjectorService extends Container {
  public settings: IDISettings = new Map();
  public logger: IDILogger = console;
  public scopes: {[key: string]: ProviderScope} = {};

  constructor() {
    super();
    const provider = this.addProvider(InjectorService).getProvider(InjectorService)!;
    provider.instance = this;
  }

  /**
   * Retrieve default scope for a given provider.
   * @param provider
   */
  public scopeOf(provider: Provider<any>) {
    return provider.scope || this.scopes[provider.type] || ProviderScope.SINGLETON;
  }

  /**
   * Clone a provider from GlobalProviders and the given token. forkProvider method build automatically the provider if the instance parameter ins't given.
   * @param token
   * @param instance
   */
  public /* async */ forkProvider(token: TokenProvider, instance?: any): Provider<any> {
    const provider = this.addProvider(token).getProvider(token)!;

    if (!instance) {
      instance = /* await */ this.invoke(token);
    }

    provider.instance = instance;

    return provider;
  }

  /**
   * Return a list of instance build by the injector.
   */
  public toArray(): any[] {
    return super.toArray().map(provider => provider.instance);
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
   * @returns {boolean}
   * @param token
   */
  has(token: TokenProvider): boolean {
    return super.has(getClassOrSymbol(token)) && !!this.get(token);
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
   * @param options
   * @returns {T} The class constructed.
   */
  public /* async */ invoke<T>(
    token: TokenProvider,
    locals: Map<TokenProvider, any> = new LocalsContainer(),
    options: Partial<IInvokeOptions<T>> = {}
  ): T {
    const provider = this.getProvider(token);
    let instance: any;

    if (locals.has(token)) {
      instance = locals.get(token);
    } else if (!provider || options.rebuild) {
      instance = /* await */ this._invoke(token, locals, options);
    } else {
      switch (this.scopeOf(provider)) {
        case ProviderScope.SINGLETON:
          if (!this.has(token)) {
            provider.instance = /* await */ this._invoke(token, locals, options);
          }

          instance = this.get<T>(token)!;
          break;

        case ProviderScope.REQUEST:
          instance = /* await */ this._invoke(token, locals, options);
          locals.set(token, instance);
          break;

        case ProviderScope.INSTANCE:
          instance = /* await */ this._invoke(provider.provide, locals, options);
          break;
      }
    }

    return instance;
  }

  /**
   * Build all providers from GlobalProviders or from given providers parameters and emit `$onInit` event.
   *
   * @param container
   */
  async load(container: Map<TokenProvider, Provider<any>> = GlobalProviders): Promise<LocalsContainer<any>> {
    const locals = new LocalsContainer();

    // Clone all providers in the container
    container.forEach((provider, token) => {
      if (!this.hasProvider(token)) {
        this.setProvider(token, provider.clone());
      }
    });

    const providers = super.toArray();

    for (const provider of providers) {
      if (!locals.has(provider.provide) && this.scopeOf(provider) === ProviderScope.SINGLETON) {
        /* await */
        this.invoke(provider.provide, locals);
      }

      if (provider.instance) {
        locals.set(provider.provide, provider.instance);
      }
    }

    await locals.emit("$onInit");

    return locals;
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
      const next = (err?: Error) => {
        if (!err) {
          return originalMethod.apply(instance, args);
        }

        throw err;
      };

      const context: IInterceptorContext<any> = {
        target,
        method: propertyKey,
        propertyKey,
        args,
        options,
        proceed: util.deprecate(next, "context.proceed() is deprecated. Use context.next() or next() parameters instead."),
        next
      };

      const interceptor = this.get<IInterceptor>(useType)!;

      if (interceptor.aroundInvoke) {
        interceptor.aroundInvoke = util.deprecate(
          interceptor.aroundInvoke.bind(interceptor),
          "interceptor.aroundInvoke is deprecated. Use interceptor.intercept instead."
        );

        return interceptor.aroundInvoke!(context, options);
      }

      return interceptor.intercept!(
        {
          ...context,
          options
        },
        next
      );
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
   * @param target
   * @param locals
   * @param options
   * @private
   */
  private /* async */ _invoke<T>(
    target: TokenProvider,
    locals: Map<TokenProvider, any>,
    options: Partial<IInvokeOptions<T>> = {}
  ): Promise<T> {
    const {token, deps, construct, isBindable} = this.mapInvokeOptions(target, options);
    const provider = this.getProvider(target);

    if (provider) {
      if (!provider.injectable && options.parent) {
        throw new InjectionError(token, `${nameOf(token)} ${provider.type} is not injectable to another provider`);
      }

      const {onInvoke} = GlobalProviders.getRegistrySettings(target);
      if (onInvoke) {
        onInvoke(provider, locals, deps);
      }
    }

    let instance: any;

    try {
      const services = [];
      for (const dependency of deps) {
        const service = /* await */ this.invoke(dependency, locals, {parent: token});
        services.push(service);
      }

      instance = construct(services);
    } catch (error) {
      throw new InjectionError(token, error);
    }

    if (instance === undefined) {
      throw new InjectionError(
        token,
        `Unable to create new instance from undefined value. Check your provider declaration for ${nameOf(token)}`
      );
    }

    if (instance && isBindable) {
      this.bindInjectableProperties(instance);
    }

    return instance;
  }

  /**
   * Create options to invoke a provider or class.
   * @param token
   * @param options
   */
  private mapInvokeOptions(token: TokenProvider, options: Partial<IInvokeOptions<any>>): IInvokeSettings {
    const {useScope = false} = options;
    let deps: TokenProvider[] | undefined = options.deps;
    let scope = options.scope;
    let construct = (deps: TokenProvider[]) => new token(...deps);
    let isBindable = false;

    if (!token) {
      throw new UndefinedTokenError();
    }

    if (this.hasProvider(token)) {
      const provider = this.getProvider(token)!;

      scope = scope || this.scopeOf(provider);
      deps = deps || provider.deps;

      if (provider.useValue) {
        construct = () => (isFunction(provider.useValue) ? provider.useValue() : provider.useValue);
      } else if (provider.useFactory) {
        construct = (deps: TokenProvider[]) => provider.useFactory(...deps);
      } else if (provider.useClass) {
        isBindable = true;
        deps = deps || Metadata.getParamTypes(provider.useClass);
        construct = (deps: TokenProvider[]) => new provider.useClass(...deps);
      }
    } else {
      deps = deps || Metadata.getParamTypes(token);
    }

    return {
      token,
      scope: scope || Store.from(token).get("scope") || ProviderScope.SINGLETON,
      deps: deps! || [],
      useScope,
      isBindable,
      construct
    };
  }
}
