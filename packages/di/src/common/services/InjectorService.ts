import {
  classOf,
  deepClone,
  deepMerge,
  Hooks,
  isArray,
  isClass,
  isFunction,
  isInheritedFrom,
  isObject,
  isPromise,
  nameOf,
  Store
} from "@tsed/core";

import {DI_INVOKE_OPTIONS, DI_USE_PARAM_OPTIONS} from "../constants/constants.js";
import {Configuration} from "../decorators/configuration.js";
import {Injectable} from "../decorators/injectable.js";
import {Container} from "../domain/Container.js";
import {LocalsContainer} from "../domain/LocalsContainer.js";
import {Provider} from "../domain/Provider.js";
import {ProviderScope} from "../domain/ProviderScope.js";
import {InjectionError} from "../errors/InjectionError.js";
import type {DILogger} from "../interfaces/DILogger.js";
import type {ImportTokenProviderOpts} from "../interfaces/ImportTokenProviderOpts.js";
import type {InvokeOptions} from "../interfaces/InvokeOptions.js";
import type {ResolvedInvokeOptions} from "../interfaces/ResolvedInvokeOptions.js";
import type {TokenProvider} from "../interfaces/TokenProvider.js";
import {GlobalProviders} from "../registries/GlobalProviders.js";
import {createContainer} from "../utils/createContainer.js";
import {getConstructorDependencies} from "../utils/getConstructorDependencies.js";
import {resolveControllers} from "../utils/resolveControllers.js";
import {DIConfiguration} from "./DIConfiguration.js";

/**
 * This service contain all services collected by `@Service` or services declared manually with `InjectorService.factory()` or `InjectorService.service()`.
 *
 * ### Example:
 *
 * ```typescript
 * import {InjectorService} from "@tsed/di";
 *
 * // Import the services (all services are decorated with @Service()";
 * import MyService1 from "./services/service1.js";
 * import MyService2 from "./services/service2.js";
 * import MyService3 from "./services/service3.js";
 *
 * // When all services are imported, you can load InjectorService.
 * const injector = new InjectorService()
 *
 * await injector.load();
 *
 * const myService1 = injector.get<MyService1>(MyServcice1);
 * ```
 */
@Injectable({
  scope: ProviderScope.SINGLETON
})
export class InjectorService extends Container {
  public settings: DIConfiguration = new DIConfiguration();
  public logger: DILogger = console;
  readonly hooks = new Hooks();
  private resolvedConfiguration: boolean = false;
  #cache = new LocalsContainer();

  constructor() {
    super();
    this.#cache.set(InjectorService, this);
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
    return provider.scope || this.scopes[String(provider.type)] || ProviderScope.SINGLETON;
  }

  /**
   * Return a list of instance build by the injector.
   */
  public toArray(): any[] {
    return [...this.#cache.values()];
  }

  /**
   * Get a service or factory already constructed from his symbol or class.
   *
   * #### Example
   *
   * ```typescript
   * import {InjectorService} from "@tsed/di";
   * import MyService from "./services.js";
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
   */
  get<T = any>(token: TokenProvider<T>, options: Record<string, unknown> = {}): T | undefined {
    const instance = this.getInstance(token);

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
   * Return all instance of the same provider type
   */
  getMany<Type = any>(type: any, locals?: LocalsContainer, options?: Partial<InvokeOptions>): Type[] {
    return this.getProviders(type).map((provider) => {
      return this.invoke(provider.token, locals, options)!;
    });
  }

  /**
   * The has() method returns a boolean indicating whether an element with the specified key exists or not.
   */
  has(token: TokenProvider): boolean {
    return this.#cache.get(token) !== undefined;
  }

  /**
   * Declare an alias for a given token.
   */
  alias(token: TokenProvider, alias: TokenProvider) {
    this.#cache.set(alias, this.#cache.get(token));

    return this;
  }

  /**
   * Invoke the class and inject all services that required by the class constructor.
   *
   * #### Example
   *
   * ```typescript
   * import {InjectorService} from "@tsed/di";
   * import MyService from "./services.js";
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
   * @returns {Type} The class constructed.
   */
  public invoke<Type = any>(token: TokenProvider<Type>, locals?: LocalsContainer, options: Partial<InvokeOptions> = {}): Type {
    let instance: any = locals ? locals.get(token) : undefined;

    if (instance !== undefined) {
      return instance;
    }

    if (token === Configuration) {
      return this.settings as unknown as Type;
    }

    instance = !options.rebuild ? this.getInstance(token) : undefined;

    if (instance != undefined) {
      return instance;
    }

    if (token === DI_USE_PARAM_OPTIONS) {
      return options.useOpts as Type;
    }

    const provider = this.ensureProvider(token);

    const set = (instance: any) => {
      this.#cache.set(token, instance);
      provider?.alias && this.alias(token, provider.alias);
    };

    if (!provider || options.rebuild) {
      instance = this.resolve(token, locals, options);

      if (this.hasProvider(token)) {
        set(instance);
      }

      return instance;
    }

    instance = this.resolve(token, locals, options);

    switch (this.scopeOf(provider)) {
      case ProviderScope.SINGLETON:
        if (provider.hooks && !options.rebuild) {
          this.registerHooks(provider, instance);
        }

        if (!provider.isAsync() || !isPromise(instance)) {
          set(instance);
          // locals?.delete(DI_USE_PARAM_OPTIONS);
          return instance;
        }

        // store promise to lock token in cache
        set(instance);

        instance = instance.then((instance: any) => {
          set(instance);

          return instance;
        });
        // locals?.delete(DI_USE_PARAM_OPTIONS);
        return instance;

      case ProviderScope.REQUEST:
        if (locals) {
          locals.set(token, instance);

          if (provider.hooks && provider.hooks.$onDestroy) {
            locals.hooks.on("$onDestroy", (...args: any[]) => provider.hooks!.$onDestroy(instance, ...args));
          }
        }

        // locals?.delete(DI_USE_PARAM_OPTIONS);

        return instance;
    }

    return instance;
  }

  /**
   * Build only providers which are asynchronous.
   */
  async loadAsync() {
    for (const [, provider] of this) {
      if (!this.has(provider.token) && provider.isAsync()) {
        await this.invoke(provider.token);
      }
    }
  }

  /**
   * Build only providers which are synchronous.
   */
  loadSync() {
    for (const [, provider] of this) {
      if (!this.has(provider.token) && this.scopeOf(provider) === ProviderScope.SINGLETON) {
        this.invoke(provider.token);
      }
    }
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

    // allow mocking or changing provider instance before loading injector
    this.resolveImportsProviders();

    return this;
  }

  /**
   * Load injector from a given module
   * @param rootModule
   */
  loadModule(rootModule: TokenProvider) {
    this.settings.routes = this.settings.routes.concat(resolveControllers(this.settings));

    const container = createContainer();
    container.delete(rootModule);

    container.addProvider(rootModule, {
      type: "server:module",
      scope: ProviderScope.SINGLETON
    });

    return this.load(container);
  }

  /**
   * Build all providers from given container (or GlobalProviders) and emit `$onInit` event.
   *
   * @param container
   */
  async load(container: Container = createContainer()) {
    this.bootstrap(container);

    // build async and sync provider
    await this.loadAsync();

    // load sync provider
    this.loadSync();

    await this.emit("$beforeInit");
    await this.emit("$onInit");
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
      if (provider.configuration && provider.type !== "server:module") {
        Object.entries(provider.configuration).forEach(([key, value]) => {
          if (!["resolvers", "mount", "imports"].includes(key)) {
            value = mergedConfiguration.has(key) ? deepMerge(mergedConfiguration.get(key), value) : deepClone(value);
            mergedConfiguration.set(key, value);
          }
        });
      }

      if (provider.resolvers) {
        this.settings.resolvers = this.settings.resolvers.concat(provider.resolvers);
      }
    });

    mergedConfiguration.forEach((value, key) => {
      this.settings.set(key, deepMerge(value, this.settings.get(key)));
    });

    this.resolvedConfiguration = true;
  }

  /**
   * Emit an event to all service. See service [lifecycle hooks](/docs/services.md#lifecycle-hooks).
   * @param eventName The event name to emit at all services.
   * @param args List of the parameters to give to each service.
   * @returns A list of promises.
   */
  public emit(eventName: string, ...args: any[]): Promise<void> {
    return this.hooks.asyncEmit(eventName, args);
  }

  /**
   * Alter value attached to an event.
   * @param eventName
   * @param value
   * @param args
   */
  public alter<T = any>(eventName: string, value: any, ...args: any[]): T {
    return this.hooks.alter(eventName, value, args);
  }

  /**
   * Alter value attached to an event asynchronously.
   * @param eventName
   * @param value
   * @param args
   */
  public alterAsync<T = any>(eventName: string, value: any, ...args: any[]): Promise<T> {
    return this.hooks.asyncAlter(eventName, value, args);
  }

  /**
   * Destroy the injector and all services.
   */
  async destroy() {
    await this.emit("$onDestroy");
  }

  /**
   * Ensure that a provider is added to the container.
   * @protected
   */
  protected ensureProvider(token: TokenProvider, force: true): Provider;
  protected ensureProvider(token: TokenProvider, force: false): Provider | undefined;
  protected ensureProvider(token: TokenProvider): Provider | undefined;
  protected ensureProvider(token: TokenProvider, force = false): Provider | undefined {
    if (!this.hasProvider(token) && (GlobalProviders.has(token) || force)) {
      this.addProvider(token);
    }

    return this.getProvider(token)!;
  }

  protected getInstance(token: any) {
    return this.#cache.get(token);
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
  protected resolve<T>(
    target: TokenProvider,
    locals: LocalsContainer = new LocalsContainer(),
    options: Partial<InvokeOptions> = {}
  ): T | Promise<T> {
    const resolvedOpts = this.mapInvokeOptions(target, locals, options);

    if (!resolvedOpts) {
      return undefined as T;
    }

    const {token, deps, construct, imports, provider} = resolvedOpts;

    if (provider) {
      GlobalProviders.onInvoke(provider, locals, {...resolvedOpts, injector: this});
    }

    let instance: any;
    let currentDependency: any = false;

    try {
      const invokeDependency =
        (parent?: any) =>
        (token: TokenProvider | [TokenProvider], index: number): any => {
          currentDependency = {token, index, deps};

          if (isArray(token)) {
            return this.getMany(token[0], locals, options);
          }

          const useOpts = provider?.store?.get(`${DI_USE_PARAM_OPTIONS}:${index}`) || options.useOpts;

          return isInheritedFrom(token, Provider, 1) ? provider : this.invoke(token, locals, {parent, useOpts});
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

    if (instance && isClass(classOf(instance))) {
      Reflect.defineProperty(instance, DI_INVOKE_OPTIONS, {
        get: () => ({rebuild: options.rebuild, locals})
      });
    }

    return instance;
  }

  private resolveImportsProviders() {
    this.settings.imports = this.settings.imports
      ?.filter((meta) => isObject(meta) && "token" in meta && meta.token !== InjectorService)
      .map((meta) => {
        if (isObject(meta) && "token" in meta) {
          const {token, ...props} = meta;

          const provider = this.ensureProvider(token, true);

          if (provider) {
            provider.useValue = undefined;
            provider.useAsyncFactory = undefined;
            provider.useFactory = undefined;

            if ("useClass" in props) {
              provider.useClass = props.useClass;
              return;
            }

            if ("useFactory" in props) {
              provider.useFactory = props.useFactory as never;
              return;
            }

            if ("useAsyncFactory" in props) {
              provider.useAsyncFactory = props.useAsyncFactory as never;
              return;
            }

            if ("use" in props) {
              provider.useValue = props.use;
              return;
            }
          }
        }

        return meta;
      })
      .filter(Boolean) as unknown as (TokenProvider | ImportTokenProviderOpts)[];
  }

  /**
   * Create options to invoke a provider or class.
   * @param token
   * @param locals
   * @param options
   */
  private mapInvokeOptions(
    token: TokenProvider,
    locals: Map<TokenProvider, any>,
    options: Partial<InvokeOptions>
  ): ResolvedInvokeOptions | false {
    let imports: (TokenProvider | [TokenProvider])[] | undefined = options.imports;
    let deps: TokenProvider[] | undefined = options.deps;
    let scope = options.scope;
    let construct;

    if (!token || token === Object) {
      throw new Error("Given token is undefined. Could mean a circular dependency problem. Try to use @Inject(() => Token) to solve it.");
    }

    let provider: Provider;

    if (!this.hasProvider(token)) {
      provider = new Provider(token);

      this.resolvers.forEach((resolver) => {
        const result = resolver.get(token, locals.get(DI_USE_PARAM_OPTIONS));

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
      construct = (deps: any[]) => provider.useFactory!(...deps);
    } else if (provider.useAsyncFactory) {
      construct = async (deps: any[]) => {
        deps = await Promise.all(deps);
        return provider.useAsyncFactory!(...deps);
      };
    } else if (provider.useClass) {
      // useClass
      deps = deps || getConstructorDependencies(provider.useClass);
      construct = (deps: TokenProvider[]) => new provider.useClass(...deps);
    } else {
      return false;
    }

    return {
      token,
      scope: scope || Store.from(token).get("scope") || ProviderScope.SINGLETON,
      deps: deps! || [],
      imports: imports || [],
      construct,
      provider
    };
  }

  private registerHooks(provider: Provider, instance: any) {
    if (provider.hooks) {
      Object.entries(provider.hooks).forEach(([event, cb]) => {
        const callback = (...args: any[]) => cb(this.get(provider.token) || instance, ...args);

        this.hooks.on(event, callback);
      });
    }
  }
}
