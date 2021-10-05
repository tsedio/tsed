import {
  ancestorsOf,
  classOf,
  deepClone,
  deepMerge,
  getClassOrSymbol,
  isFunction,
  isInheritedFrom,
  isPromise,
  Metadata,
  nameOf,
  prototypeOf,
  Store
} from "@tsed/core";
import {DI_PARAM_OPTIONS, INJECTABLE_PROP} from "../constants";
import {Configuration} from "../decorators/configuration";
import {Injectable} from "../decorators/injectable";
import {DIContext, InjectablePropertyType, ProviderScope} from "../domain";
import {Container} from "../domain/Container";
import {LocalsContainer} from "../domain/LocalsContainer";
import {Provider} from "../domain/Provider";
import {InjectionError} from "../errors/InjectionError";
import {UndefinedTokenError} from "../errors/UndefinedTokenError";
import {
  DILogger,
  InjectableProperties,
  InjectablePropertyService,
  InjectablePropertyValue,
  InterceptorContext,
  InterceptorMethods,
  InvokeOptions,
  IProvider,
  TokenProvider
} from "../interfaces";
import {GlobalProviders} from "../registries/GlobalProviders";
import {createContainer} from "../utils/createContainer";
import {DIConfiguration} from "./DIConfiguration";

interface InvokeSettings {
  token: TokenProvider;
  parent?: TokenProvider;
  scope: ProviderScope;
  isBindable: boolean;
  deps: TokenProvider[];
  imports: TokenProvider[];
  provider: Provider<any>;

  construct(deps: TokenProvider[]): any;
}

/**
 * This service contain all services collected by `@Service` or services declared manually with `InjectorService.factory()` or `InjectorService.service()`.
 *
 * ### Example:
 *
 * ```typescript
 * import {InjectorService} from "@tsed/di";
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
 */
@Injectable({
  scope: ProviderScope.SINGLETON,
  global: true
})
export class InjectorService extends Container {
  public settings: TsED.Configuration & DIConfiguration = new DIConfiguration() as any;
  public logger: DILogger = console;
  private resolvedConfiguration: boolean = false;

  constructor() {
    super();
    const provider = this.addProvider(InjectorService).getProvider(InjectorService)!;
    provider.instance = this;
  }

  get resolvers() {
    return this.settings.resolvers!;
  }

  get scopes() {
    return this.settings.scopes || {};
  }

  /**
   * Retrieve default scope for a given provider.
   * @param provider
   */
  public scopeOf(provider: Provider) {
    return provider.scope || this.scopes[provider.type] || ProviderScope.SINGLETON;
  }

  /**
   * Clone a provider from GlobalProviders and the given token. forkProvider method build automatically the provider if the instance parameter ins't given.
   * @param token
   * @param settings
   */
  public forkProvider(token: TokenProvider, settings: Partial<IProvider<any>> = {}): Provider {
    if (!this.hasProvider(token)) {
      this.addProvider(token);
    }

    const provider = this.getProvider(token)!;

    Object.assign(provider, settings);

    provider.instance = this.invoke(token);

    return provider;
  }

  /**
   * Return a list of instance build by the injector.
   */
  public toArray(): any[] {
    return super.toArray().map((provider) => provider.instance);
  }

  /**
   * Get a service or factory already constructed from his symbol or class.
   *
   * #### Example
   *
   * ```typescript
   * import {InjectorService} from "@tsed/di";
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
   * @param options
   * @returns {boolean}
   */
  get<T = any>(token: TokenProvider, options: any = {}): T | undefined {
    const instance = super.get(getClassOrSymbol(token))?.instance;

    if (instance !== undefined) {
      return instance;
    }

    if (!this.hasProvider(token)) {
      for (const resolver of this.resolvers) {
        const result = resolver.get(token, options);

        if (result !== undefined) {
          return result;
        }
      }
    }
  }

  /**
   * The has() method returns a boolean indicating whether an element with the specified key exists or not.
   * @returns {boolean}
   * @param token
   */
  has(token: TokenProvider): boolean {
    return super.has(getClassOrSymbol(token)) && this.get(token) !== undefined;
  }

  /**
   * Invoke the class and inject all services that required by the class constructor.
   *
   * #### Example
   *
   * ```typescript
   * import {InjectorService} from "@tsed/di";
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
    options: Partial<InvokeOptions<T>> = {}
  ): T {
    const provider = this.ensureProvider(token);
    let instance: any;

    !locals.has(Configuration) && locals.set(Configuration, this.settings);

    if (locals.has(token)) {
      return locals.get(token);
    }

    if (token === DI_PARAM_OPTIONS) {
      return {} as T;
    }

    if (!provider || options.rebuild) {
      instance = this.resolve(token, locals, options);
      this.hasProvider(token) && (this.getProvider(token)!.instance = instance);

      return instance;
    }

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

    return instance;
  }

  /**
   * Build only providers which are asynchronous.
   */
  async loadAsync(locals: LocalsContainer<any> = new LocalsContainer()) {
    for (const [, provider] of this) {
      if (!locals.has(provider.token)) {
        if (provider.isAsync()) {
          await this.invoke(provider.token, locals);
        }

        if (provider.instance) {
          locals.set(provider.token, provider.instance);
        }
      }
    }

    return locals;
  }

  loadSync(locals: LocalsContainer<any> = new LocalsContainer()) {
    for (const [, provider] of this) {
      if (!locals.has(provider.token) && this.scopeOf(provider) === ProviderScope.SINGLETON) {
        this.invoke(provider.token, locals);
      }

      if (provider.instance !== undefined) {
        locals.set(provider.token, provider.instance);
      }
    }

    return locals;
  }

  /**
   * Boostrap injector from container and resolve configuration.
   *
   * @param container
   */
  bootstrap(container: Container = createContainer()) {
    // Clone all providers in the container
    this.addProviders(container);

    // Resolve all configuration
    this.resolveConfiguration();

    return this;
  }

  /**
   * Build all providers from given container (or GlobalProviders) and emit `$onInit` event.
   *
   * @param container
   * @param rootModule
   */
  async load(container: Container = createContainer(), rootModule?: TokenProvider): Promise<LocalsContainer<any>> {
    this.bootstrap(container);

    // build async and sync provider
    let locals = await this.loadAsync();

    if (rootModule) {
      await this.invoke(rootModule);
    }

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
    const mergedConfiguration = new Map();

    super.forEach((provider) => {
      if (provider.configuration) {
        Object.entries(provider.configuration).forEach(([key, value]) => {
          value = mergedConfiguration.has(key) ? deepMerge(mergedConfiguration.get(key), value) : deepClone(value);
          mergedConfiguration.set(key, value);
        });
      }
      if (provider.resolvers) {
        this.resolvers.push(...provider.resolvers);
      }
    });

    mergedConfiguration.forEach((value, key) => {
      this.settings[key] = deepMerge(value, this.settings[key]);
    });

    this.settings.build();

    this.resolvedConfiguration = true;
  }

  /**
   *
   * @param instance
   * @param locals
   * @param options
   */
  public bindInjectableProperties(instance: any, locals: Map<TokenProvider, any>, options: Partial<InvokeOptions>) {
    const properties: InjectableProperties = ancestorsOf(classOf(instance)).reduce((properties: any, target: any) => {
      const store = Store.from(target);

      return {
        ...properties,
        ...(store.get(INJECTABLE_PROP) || {})
      };
    }, {});

    Object.values(properties).forEach((definition) => {
      switch (definition.bindingType) {
        case InjectablePropertyType.METHOD:
          this.bindMethod(instance, definition);
          break;
        case InjectablePropertyType.PROPERTY:
          this.bindProperty(instance, definition, locals, options);
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

  /**
   *
   * @param instance
   * @param {string} propertyKey
   */
  public bindMethod(instance: any, {propertyKey}: InjectablePropertyService) {
    const target = classOf(instance);
    const originalMethod = instance[propertyKey];
    const deps = Metadata.getParamTypes(prototypeOf(target), propertyKey);

    instance[propertyKey] = () => {
      const services = deps.map((dependency: any) => this.get(dependency));

      return originalMethod.call(instance, ...services);
    };
  }

  /**
   * Create an injectable property.
   *
   * @param instance
   * @param {string} propertyKey
   * @param {any} useType
   * @param onGet
   * @param options
   * @param locals
   * @param invokeOptions
   */
  public bindProperty(
    instance: any,
    {propertyKey, useType, onGet = (f: any) => f, options}: InjectablePropertyService,
    locals: Map<TokenProvider, any>,
    invokeOptions: Partial<InvokeOptions>
  ) {
    invokeOptions = {...invokeOptions};
    locals.set(DI_PARAM_OPTIONS, {...options});

    let bean: any = this.invoke(useType, locals, invokeOptions);

    locals.delete(DI_PARAM_OPTIONS);

    if (isPromise(bean)) {
      bean.then((result: any) => {
        bean = result;
      });
    }

    Object.defineProperty(instance, propertyKey, {
      get: () => onGet(bean)
    });
  }

  /**
   *
   * @param instance
   * @param {string} propertyKey
   * @param {any} useType
   */
  public bindValue(instance: any, {propertyKey, expression, defaultValue}: InjectablePropertyValue) {
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
  public bindConstant(instance: any, {propertyKey, expression, defaultValue}: InjectablePropertyValue): PropertyDescriptor {
    let bean: any;

    const get = () => {
      if (bean !== undefined) {
        return bean;
      }

      const value = this.settings.get(expression, defaultValue);
      bean = Object.freeze(deepClone(value));

      return bean;
    };

    const descriptor = {
      get,
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
  public bindInterceptor(instance: any, {propertyKey, useType, options}: InjectablePropertyService) {
    const target = classOf(instance);
    const originalMethod = instance[propertyKey];

    instance[propertyKey] = (...args: any[]) => {
      const next = (err?: Error) => {
        if (!err) {
          return originalMethod.apply(instance, args);
        }

        throw err;
      };

      const context: InterceptorContext<any> = {
        target,
        propertyKey,
        args,
        options,
        next
      };

      const interceptor = this.get<InterceptorMethods>(useType)!;

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
   * Allow handler hack for AsyncHookContext plugin.
   * @param ctx
   * @param cb
   * @protected
   */
  runInContext(ctx: DIContext, cb: any) {
    return cb();
  }

  protected ensureProvider(token: TokenProvider): Provider | undefined {
    if (!this.hasProvider(token) && GlobalProviders.has(token)) {
      this.addProvider(token);
    }

    return this.getProvider(token)!;
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
  private resolve<T>(target: TokenProvider, locals: Map<TokenProvider, any>, options: Partial<InvokeOptions<T>> = {}): Promise<T> {
    const {token, deps, construct, isBindable, imports, provider} = this.mapInvokeOptions(target, locals, options);

    if (provider) {
      GlobalProviders.onInvoke(provider, locals, deps);
    }

    let instance: any;
    let currentDependency: any = false;

    try {
      const invokeDependency = (parent?: any) => (token: any, index: number): any => {
        currentDependency = {token, index, deps};

        if (token !== DI_PARAM_OPTIONS) {
          const options = provider?.store?.get(`${DI_PARAM_OPTIONS}:${index}`);

          locals.set(DI_PARAM_OPTIONS, options || {});
        }

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
      this.bindInjectableProperties(instance, locals, options);
    }

    return instance;
  }

  /**
   * Create options to invoke a provider or class.
   * @param token
   * @param locals
   * @param options
   */
  private mapInvokeOptions(token: TokenProvider, locals: Map<TokenProvider, any>, options: Partial<InvokeOptions<any>>): InvokeSettings {
    let imports: TokenProvider[] | undefined = options.imports;
    let deps: TokenProvider[] | undefined = options.deps;
    let scope = options.scope;
    let construct;
    let isBindable = false;

    if (!token) {
      throw new UndefinedTokenError();
    }

    let provider: Provider;

    if (!this.hasProvider(token)) {
      provider = new Provider(token);

      this.resolvers.forEach((resolver) => {
        const result = resolver.get(token, locals.get(DI_PARAM_OPTIONS));

        if (result !== undefined) {
          provider.useFactory = () => result;
        }
      });
    } else {
      provider = this.getProvider(token)!;
    }

    scope = scope || this.scopeOf(provider);
    deps = deps || provider.deps;
    imports = imports || provider.imports;

    if (provider.useValue !== undefined) {
      construct = () => (isFunction(provider.useValue) ? provider.useValue() : provider.useValue);
    } else if (provider.useFactory) {
      construct = (deps: TokenProvider[]) => provider.useFactory(...deps);
    } else if (provider.useAsyncFactory) {
      construct = async (deps: TokenProvider[]) => {
        deps = await Promise.all(deps);
        return provider.useAsyncFactory(...deps);
      };
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
      construct,
      provider
    };
  }
}
