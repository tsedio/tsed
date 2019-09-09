import {deepClone, getClass, getClassOrSymbol, isFunction, isInheritedFrom, Metadata, nameOf, prototypeOf, Store} from "@tsed/core";

import * as util from "util";
import {Container} from "../class/Container";
import {LocalsContainer} from "../class/LocalsContainer";
import {Provider} from "../class/Provider";
import {Configuration} from "../decorators/configuration";
import {Injectable} from "../decorators/injectable";
import {InjectionError} from "../errors/InjectionError";
import {UndefinedTokenError} from "../errors/UndefinedTokenError";
import {
  IDIConfigurationOptions,
  IDILogger,
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
import {DIConfiguration} from "./DIConfiguration";

interface IInvokeSettings {
  token: TokenProvider;
  parent?: TokenProvider;
  scope: ProviderScope;
  isBindable: boolean;
  deps: any[];
  imports: any[];

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
 *
 * await injector.load();
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
  public settings: IDIConfigurationOptions & DIConfiguration = new DIConfiguration() as any;
  public logger: IDILogger = console;
  private resolvedConfiguration: boolean = false;

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
    return provider.scope || this.settings.scopes[provider.type] || ProviderScope.SINGLETON;
  }

  /**
   * Clone a provider from GlobalProviders and the given token. forkProvider method build automatically the provider if the instance parameter ins't given.
   * @param token
   * @param instance
   */
  public forkProvider(token: TokenProvider, instance?: any): Provider<any> {
    const provider = this.addProvider(token).getProvider(token)!;

    if (!instance) {
      instance = this.invoke(token);
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
  public invoke<T>(
    token: TokenProvider,
    locals: Map<TokenProvider, any> = new LocalsContainer(),
    options: Partial<IInvokeOptions<T>> = {}
  ): T {
    const provider = this.getProvider(token);
    let instance: any;

    locals.set(Configuration, this.settings);

    if (locals.has(token)) {
      instance = locals.get(token);
    } else if (!provider || options.rebuild) {
      instance = this.resolve(token, locals, options);
    } else {
      switch (this.scopeOf(provider)) {
        case ProviderScope.SINGLETON:
          if (!this.has(token)) {
            provider.instance = this.resolve(token, locals, options);

            if (provider.isAsync()) {
              provider.instance.then((instance: any) => {
                provider.instance = instance;
              });
            }
          }

          instance = this.get<T>(token)!;
          break;

        case ProviderScope.REQUEST:
          instance = this.resolve(token, locals, options);
          locals.set(token, instance);
          break;

        case ProviderScope.INSTANCE:
          instance = this.resolve(provider.provide, locals, options);
          break;
      }
    }

    return instance;
  }

  /**
   * Build only providers which are asynchronous.
   */
  async loadAsync(locals: LocalsContainer<any> = new LocalsContainer()) {
    const providers = super.toArray();

    for (const provider of providers) {
      if (!provider.root) {
        if (!locals.has(provider.token)) {
          if (provider.isAsync()) {
            await this.invoke(provider.token, locals);
          }

          if (provider.instance) {
            locals.set(provider.token, provider.instance);
          }
        }
      }
    }

    return locals;
  }

  loadSync(locals: LocalsContainer<any> = new LocalsContainer()) {
    const providers = super.toArray();

    for (const provider of providers) {
      if (!provider.root) {
        if (!locals.has(provider.token) && this.scopeOf(provider) === ProviderScope.SINGLETON) {
          this.invoke(provider.token, locals);
        }

        if (provider.instance) {
          locals.set(provider.token, provider.instance);
        }
      }
    }

    return locals;
  }

  /**
   * Build all providers from given container (or GlobalProviders) and emit `$onInit` event.
   *
   * @param container
   */
  async load(container: Map<TokenProvider, Provider<any>> = GlobalProviders): Promise<LocalsContainer<any>> {
    // Clone all providers in the container
    this.addProviders(container);

    // Resolve configuration from providers
    this.resolveConfiguration();

    // build async and sync provider
    let locals = await this.loadAsync();

    // load sync provider
    locals = this.loadSync(locals);

    await locals.emit("$onInit");

    return locals;
  }

  /**
   * Load all configurations registered on providers
   */
  resolveConfiguration() {
    if (this.resolvedConfiguration) {
      return;
    }

    const rawSettings = this.settings.toRawObject();

    // @ts-ignore
    this.settings.map.clear();

    super.forEach(provider => {
      if (provider.configuration) {
        this.settings.merge(provider.configuration);
      }
    });

    this.settings.merge(rawSettings);

    this.resolvedConfiguration = true;
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
  private resolve<T>(target: TokenProvider, locals: Map<TokenProvider, any>, options: Partial<IInvokeOptions<T>> = {}): Promise<T> {
    const {token, deps, construct, isBindable, imports} = this.mapInvokeOptions(target, options);
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
    let currentDependency: any = false;

    try {
      const invokeDependency = (parent?: any) => (token: any, index: number): any => {
        currentDependency = {token, index, deps};

        return isInheritedFrom(token, Provider, 1) ? provider : this.invoke(token, locals, {parent});
      };

      // Invoke manually imported providers
      imports.forEach(invokeDependency());

      // Inject dependencies
      const services = deps.map(invokeDependency(token));

      currentDependency = false;

      instance = construct(services);
    } catch (error) {
      InjectionError.throwInjectorError(token, currentDependency, error);
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
    let imports: TokenProvider[] | undefined = options.imports;
    let deps: TokenProvider[] | undefined = options.deps;
    let scope = options.scope;
    let construct;
    let isBindable = false;

    if (!token) {
      throw new UndefinedTokenError();
    }

    const provider = this.hasProvider(token) ? this.getProvider(token)! : new Provider(token);

    scope = scope || this.scopeOf(provider);
    deps = deps || provider.deps;
    imports = imports || provider.imports;

    if (provider.useValue) {
      construct = () => (isFunction(provider.useValue) ? provider.useValue() : provider.useValue);
    } else if (provider.useFactory) {
      construct = (deps: TokenProvider[]) => provider.useFactory(...deps);
    } else if (provider.useAsyncFactory) {
      construct = (deps: TokenProvider[]) => provider.useAsyncFactory(...deps);
    } else {
      // useClass
      isBindable = true;
      deps = deps || Metadata.getParamTypes(provider.useClass);
      construct = (deps: TokenProvider[]) => new provider.useClass(...deps);
    }

    return {
      token,
      scope: scope || Store.from(token).get("scope") || ProviderScope.SINGLETON,
      deps: deps! || [],
      imports: imports || [],
      isBindable,
      construct
    };
  }
}
