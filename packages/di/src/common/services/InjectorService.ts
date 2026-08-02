import {$alter, $asyncAlter, $asyncEmit, $emit, $off, $on} from "@tsed/hooks";
import {DI_INVOKE_OPTIONS, DI_USE_PARAM_OPTIONS} from "../constants/constants.js";
import {Container} from "../domain/Container.js";
import {DIConfiguration} from "./DIConfiguration.js";
import type {DILogger} from "../interfaces/DILogger.js";
import type {ImportTokenProviderOpts} from "../interfaces/ImportTokenProviderOpts.js";
import type {ProviderOpts} from "../interfaces/ProviderOpts.js";
import {InjectionError} from "../errors/InjectionError.js";
import type {InvokeOptions} from "../interfaces/InvokeOptions.js";
import {LocalsContainer} from "../domain/LocalsContainer.js";
import {Provider} from "../domain/Provider.js";
import {ProviderScope} from "../domain/ProviderScope.js";
import type {ResolvedInvokeOptions} from "../interfaces/ResolvedInvokeOptions.js";
import type {TokenProvider} from "../interfaces/TokenProvider.js";
import {classOf} from "@tsed/core/utils/classOf.js";
import {createContainer} from "../utils/createContainer.js";
import {deepClone} from "@tsed/core/utils/deepClone.js";
import {deepMerge} from "@tsed/core/utils/deepMerge.js";
import {getConstructorDependencies} from "../utils/getConstructorDependencies.js";
import {isArray} from "@tsed/core/utils/isArray.js";
import {isClass} from "@tsed/core/utils/isClass.js";
import {isFunction} from "@tsed/core/utils/isFunction.js";
import {isInheritedFrom} from "@tsed/core/utils/isInheritedFrom.js";
import {isObject} from "@tsed/core/utils/isObject.js";
import {isPromise} from "@tsed/core/utils/isPromise.js";
import {nameOf} from "@tsed/core/utils/nameOf.js";
import type {ProviderType} from "../domain/ProviderType.js";

const EXCLUDED_CONFIGURATION_KEYS = ["mount", "imports"];

/**
 * Core dependency injection orchestrator managing provider lifecycle and resolution.
 *
 * The main service responsible for registering, resolving, and managing all injectable providers.
 * Handles dependency graph resolution, instance caching, scope management, and lifecycle hooks.
 *
 * ### Usage
 *
 * ```typescript
 * import {InjectorService} from "@tsed/di";
 *
 * // Import the services (all services are decorated with @Service())
 * import MyService1 from "./services/service1.js";
 * import MyService2 from "./services/service2.js";
 * import MyService3 from "./services/service3.js";
 *
 * // When all services are imported, you can load InjectorService
 * await injector().load();
 *
 * const myService1 = injector.get<MyService1>(MyService1);
 * ```
 *
 * @public
 */
export class InjectorService {
  public logger: DILogger = console;
  /*readonly */
  settings = new DIConfiguration();
  /**
   * Providers containers
   * @private
   */
  readonly #providers = new Container();
  /**
   * Cached instance
   * @private
   */
  readonly #cache = new LocalsContainer();
  private resolvedConfiguration: boolean = false;
  #loaded: boolean = false;
  #hooksReady: boolean = false;
  #registeredSingletonHooks = new Set<TokenProvider>();
  #resolvingProviders = new Set<TokenProvider>();

  constructor() {
    this.#cache.set(InjectorService, this);
    this.#cache.set(DIConfiguration, this.settings);
  }

  get providers(): Pick<Container, "get" | "has" | "getMany"> {
    return this.#providers;
  }

  isLoaded() {
    return this.#loaded;
  }

  public add(token: TokenProvider, settings: Partial<ProviderOpts> = {}): this {
    this.#providers.add(token, settings);
    this.setProvider(token, this.#providers.get(token)!);

    return this;
  }

  /**
   * @alias InjectorService.add
   */
  public addProvider(token: TokenProvider, settings: Partial<ProviderOpts> = {}): this {
    return this.add(token, settings);
  }

  public setProvider(token: TokenProvider, provider: Provider): this {
    this.#providers.set(token, provider);

    if (this.#registeredSingletonHooks.delete(token)) {
      $off(token);
    }

    if (provider.scope === ProviderScope.SINGLETON && (!this.#loaded || this.#hooksReady)) {
      this.registerHooks(provider, {});
    }

    return this;
  }

  /**
   * Get a provider definition from the provider registry.
   *
   * Unlike `get()`, this method does not resolve the provider instance.
   * @deprecated Since v8. Use injector().providers.get() instead
   */
  public getProvider<T extends Provider = Provider>(token: TokenProvider | undefined): T | undefined {
    return this.#providers.get<T>(token);
  }

  /**
   * Get provider definitions matching a type.
   *
   * Unlike `getMany()`, this method does not resolve provider instances.
   * @deprecated Since v8. Use injector().providers.getMany() instead.
   */
  public getProviders(type?: TokenProvider | ProviderType | string | string[]): Provider[] {
    return this.#providers.getMany(type);
  }

  /**
   * Return a list of all instances built by the injector.
   *
   * @returns An array of all cached provider instances
   */
  public toArray(): any[] {
    return [...this.#cache.values()];
  }

  /**
   * Get a service or factory already constructed from its symbol or class.
   *
   * Returns the cached instance if available, otherwise resolves and caches the provider.
   *
   * ### Usage
   *
   * ```typescript
   * import {InjectorService} from "@tsed/di";
   * import MyService from "./services.js";
   *
   * class OtherService {
   *   constructor(injectorService: InjectorService) {
   *     const myService = injectorService.get<MyService>(MyService);
   *   }
   * }
   * ```
   *
   * @param token The class or symbol registered in InjectorService
   * @param options Optional invocation options
   * @returns The resolved provider instance
   */
  get<T = any>(token: TokenProvider<T>, options?: Partial<InvokeOptions>): T {
    const instance = this.#cache.get(token);

    if (instance === undefined) {
      return this.resolve(token, options);
    }

    return instance;
  }

  /**
   * Return all instances of providers matching the specified type.
   *
   * Retrieves all providers of a given type and resolves their instances.
   *
   * @param type The provider type to filter by (e.g., ProviderType.CONTROLLER)
   * @param options Optional invocation options
   * @returns Array of resolved instances matching the type
   */
  getMany<Type = any>(type: any, options?: Partial<InvokeOptions>): Type[] {
    return this.#providers.getMany(type).map((provider) => {
      return this.resolve<Type>(provider.token, options);
    });
  }

  /**
   * Check if a provider instance exists in the cache.
   *
   * @param token The token to check for
   * @returns `true` if the instance is cached, `false` otherwise
   */
  has(token: TokenProvider): boolean {
    return this.#cache.has(token);
  }

  /**
   * Create an alias for a provider token.
   *
   * Allows the same provider instance to be retrieved using a different token.
   *
   * @param token The original provider token
   * @param alias The alias token to register
   * @returns The injector instance for chaining
   */
  alias(token: TokenProvider, alias: TokenProvider) {
    this.#cache.set(alias, this.#cache.get(token));

    return this;
  }

  /**
   * Resolve a provider token and return its instance.
   *
   * If the token isn't cached, the injector creates the instance according to the provider configuration
   * and caches it based on the provider's scope (singleton, request, or instance).
   *
   * ### Usage
   *
   * ```typescript
   * import {InjectorService} from "@tsed/di";
   * import MyService from "./services.js";
   *
   * class OtherService {
   *   constructor(injectorService: InjectorService) {
   *     const myService = injectorService.resolve<MyService>(MyService);
   *   }
   * }
   * ```
   *
   * @param token The injectable class to invoke. Constructor parameters are injected automatically
   * @param options Optional invocation options (locals, rebuild, useOpts, etc.)
   * @returns The resolved provider instance
   */
  public resolve<Type = any>(token: TokenProvider<Type>, options: Partial<InvokeOptions> = {}): Type {
    if (options.locals?.has(token)) {
      return options.locals.get(token);
    }

    if (token === DI_USE_PARAM_OPTIONS) {
      return options.useOpts as Type;
    }

    if (token === DIConfiguration) {
      // keep this configuration for legacy code that use as custom Configuration service
      return this.settings as Type;
    }

    if (!options.rebuild && this.#cache.has(token)) {
      return this.#cache.get(token);
    }

    const provider = this.ensureProvider(token);

    // maybe not necessary
    if (!provider || options.rebuild) {
      const instance = this.invokeToken(token, options);

      if (provider) {
        return this.setToCache(provider!, instance);
      }

      return instance as Type;
    }

    const instance = this.invokeToken(token, options);

    switch (provider.scope) {
      case ProviderScope.SINGLETON:
        return this.setToCache(provider, instance);
      case ProviderScope.REQUEST:
        if (options.locals) {
          options.locals.set(provider.token, instance);

          this.registerHooks(provider, options);
        }

        return instance as Type;
    }

    return instance as Type;
  }

  /**
   * Invoke a provider token and return its instance.
   *
   * Alias for `resolve()`. If the token isn't cached, the injector creates the instance
   * according to the provider configuration.
   *
   * ### Usage
   *
   * ```typescript
   * import {InjectorService} from "@tsed/di";
   * import MyService from "./services.js";
   *
   * class OtherService {
   *   constructor(injectorService: InjectorService) {
   *     const myService = injectorService.invoke<MyService>(MyService);
   *   }
   * }
   * ```
   *
   * @param token The injectable class to invoke. Constructor parameters are injected automatically
   * @param options Optional invocation options (locals, rebuild, useOpts, etc.)
   * @returns The resolved provider instance
   * @see resolve
   */
  public invoke<Type = any>(token: TokenProvider<Type>, options: Partial<InvokeOptions> = {}): Type {
    return this.resolve(token, options);
  }

  /**
   * Build all asynchronous providers.
   *
   * Resolves providers that have async factories or async initialization.
   * Called automatically during the `load()` process.
   */
  async loadAsync() {
    for (const [, provider] of this.#providers) {
      if (!provider.isAsync()) {
        continue;
      }

      if (!this.has(provider.token)) {
        await this.resolve(provider.token);
      }
    }
  }

  /**
   * Build all synchronous singleton providers.
   *
   * Instantiates all singleton-scoped providers that haven't been cached yet.
   * Called automatically during the `load()` process after async providers.
   */
  loadSync() {
    if (this.settings.lazyProviders) {
      return;
    }

    for (const [, provider] of this.#providers) {
      if (provider.scope !== ProviderScope.SINGLETON || provider.isAsync()) {
        continue;
      }

      if (!this.has(provider.token)) {
        this.resolve(provider.token);
      }
    }
  }

  /**
   * Load and initialize all registered providers.
   *
   * Bootstraps the DI system by resolving configuration, building provider instances,
   * and triggering lifecycle hooks (`$beforeInit`, `$onInit`).
   *
   * ### Usage
   *
   * ```typescript
   * import {injector} from "@tsed/di";
   *
   * await injector().load();
   * ```
   *
   * @param container Optional container with additional providers to merge
   */
  async load(container: Container = createContainer()) {
    // avoid provider registration in the GlobalContainer during the loading phase
    // using injectable() or providerBuilder()
    this.#loaded = true;
    this.#hooksReady = true;

    await $asyncEmit("$beforeInit");

    await this.bootstrap(container);

    // build async and sync provider
    await this.loadAsync();

    // load sync provider
    this.loadSync();

    await $asyncEmit("$onInit");
  }

  /**
   * Resolve and merge all provider configurations.
   *
   * Collects configuration from all providers decorated with `@Configuration`,
   * merges them, and stores the result in the injector settings.
   * Called automatically during the load process.
   */
  async resolveConfiguration() {
    if (this.resolvedConfiguration) {
      return;
    }
    const mergedConfiguration = new Map();

    this.#providers.forEach((provider) => {
      if (provider.configuration && provider.type !== "server:module") {
        Object.entries(provider.configuration).forEach(([key, value]) => {
          if (!EXCLUDED_CONFIGURATION_KEYS.includes(key)) {
            value = mergedConfiguration.has(key) ? deepMerge(mergedConfiguration.get(key), value) : deepClone(value);
            mergedConfiguration.set(key, value);
          }
        });
      }
    });

    mergedConfiguration.forEach((value, key) => {
      this.settings.set(key, deepMerge(value, this.settings.get(key)));
    });

    await $asyncEmit("$afterResolveConfiguration", this.settings);

    this.resolvedConfiguration = true;
  }

  /**
   * Emit an event to all service. See service [lifecycle hooks](/docs/hooks.md#lifecycle-hooks).
   * @param eventName The event name to emit at all services.
   * @param args List of the parameters to give to each service.
   * @returns A list of promises.
   * @deprecated use $asyncEmit instead
   */
  public emit(eventName: string, ...args: unknown[]) {
    return $asyncEmit(eventName, args);
  }

  /**
   * Alter value attached to an event.
   * @param eventName
   * @param value
   * @param args
   * @deprecated use $alter instead
   */
  public alter<T = any>(eventName: string, value: any, ...args: any[]): T {
    return $alter(eventName, value, args);
  }

  /**
   * Alter value attached to an event asynchronously.
   * @param eventName
   * @param value
   * @param args
   * @deprecated use $asyncAlter instead
   */
  public alterAsync<T = any>(eventName: string, value: any, ...args: any[]): Promise<T> {
    return $asyncAlter(eventName, value, args);
  }

  /**
   * Destroy the injector and all services.
   */
  async destroy() {
    await $asyncEmit("$onDestroy");
    this.#cache.forEach((_, token) => {
      $off(token);
    });
    this.#registeredSingletonHooks.forEach((token) => {
      $off(token);
    });
    this.#registeredSingletonHooks.clear();
    this.#hooksReady = false;
  }

  /**
   * Bootstrap injector from container, resolve configuration and providers.
   *
   * @param container
   */
  protected async bootstrap(container: Container = createContainer()) {
    // Clone all providers in the container
    this.mergeProviders(container);

    // Resolve all configuration
    await this.resolveConfiguration();

    // allow mocking or changing provider instance before loading injector
    this.resolveImportsProviders();

    return this;
  }

  /**
   * Ensure that a provider is added to the container.
   * @protected
   */
  protected ensureProvider(token: TokenProvider, force: true): Provider;
  protected ensureProvider(token: TokenProvider, force: false): Provider | undefined;
  protected ensureProvider(token: TokenProvider): Provider | undefined;
  protected ensureProvider(token: TokenProvider, force = false): Provider | undefined {
    if (!this.#providers.has(token) && (Provider.Registry.has(token) || force)) {
      this.add(token);
    }

    return this.#providers.get(token)!;
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
   * @param options
   * @private
   */
  protected invokeToken<T>(target: TokenProvider, options: Partial<InvokeOptions> = {}): T | Promise<T> {
    const resolvedOpts = this.mapInvokeOptions(target, options);

    if (!resolvedOpts) {
      return undefined as T;
    }

    const {token, deps, construct, imports, provider} = resolvedOpts;

    this.#resolvingProviders.add(provider.token);

    try {
      $emit("$beforeInvoke", token, [resolvedOpts]);
      $emit(`$beforeInvoke:${String(provider.type)}`, [resolvedOpts]);

      let instance: any;
      let currentDependency: any = false;

      try {
        const invokeDependency =
          (parent?: any) =>
          (token: TokenProvider | [TokenProvider], index: number): any => {
            currentDependency = {token, index, deps};

            if (isArray(token)) {
              return this.getMany(token[0], options);
            }

            return isInheritedFrom(token, Provider, 1)
              ? provider
              : this.resolve(token, {
                  parent,
                  locals: options.locals,
                  useOpts: provider?.getArgOpts(index) || options.useOpts
                });
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
          get: () => ({rebuild: options.rebuild, locals: options.locals})
        });
      }

      $emit("$afterInvoke", token, [instance, resolvedOpts]);

      return instance;
    } finally {
      this.#resolvingProviders.delete(provider.token);
    }
  }

  private mergeProviders(container: Map<TokenProvider, Provider>) {
    container.forEach((provider) => {
      if (!this.#providers.has(provider.token)) {
        this.setProvider(provider.token, provider.clone());
      }
    });
  }

  private resolveImportsProviders() {
    const imports = this.settings.imports;

    if (!imports) {
      return;
    }

    const resolvedImports: (TokenProvider | ImportTokenProviderOpts)[] = [];

    for (const meta of imports) {
      if (!isObject(meta) || !("token" in meta) || meta.token === InjectorService) {
        continue;
      }

      const {token, ...props} = meta;
      const provider = this.ensureProvider(token, true);

      provider.useValue = undefined;
      provider.useAsyncFactory = undefined;
      provider.useFactory = undefined;

      if ("useClass" in props) {
        provider.useClass = props.useClass as TokenProvider;
        this.setProvider(token, provider);
        continue;
      }

      if ("useFactory" in props) {
        provider.useFactory = props.useFactory as never;
        this.setProvider(token, provider);
        continue;
      }

      if ("useAsyncFactory" in props) {
        provider.useAsyncFactory = props.useAsyncFactory as never;
        this.setProvider(token, provider);
        continue;
      }

      if ("use" in props) {
        provider.useValue = props.use as unknown;
        this.setProvider(token, provider);
        continue;
      }

      resolvedImports.push(meta);
    }

    this.settings.imports = resolvedImports;
  }

  /**
   * Create options to invoke a provider or class.
   * @param token
   * @param options
   */
  private mapInvokeOptions(token: TokenProvider, options: Partial<InvokeOptions>): ResolvedInvokeOptions | false {
    const locals = options.locals || new LocalsContainer();

    options.locals = locals;

    let imports: (TokenProvider | [TokenProvider])[] | undefined = options.imports;
    let deps: TokenProvider[] | undefined = options.deps;
    let construct;

    if (!token || token === Object) {
      throw new Error("Given token is undefined. Could mean a circular dependency problem. Try to use @Inject(() => Token) to solve it.");
    }

    const provider = this.#providers.get(token) || new Provider(token);

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
      deps: deps! || [],
      imports: imports || [],
      construct,
      provider,
      locals
    };
  }

  private registerHooks(provider: Provider, options: Partial<InvokeOptions>) {
    if (provider.hooks) {
      if (provider.scope === ProviderScope.REQUEST) {
        if (options.locals && provider.hooks?.$onDestroy) {
          const {locals} = options;

          options.locals.hooks.on("$onDestroy", (...args: unknown[]) => {
            return provider.hooks?.$onDestroy?.(locals.get(provider.token), ...args);
          });
        }

        return;
      }

      if (this.#registeredSingletonHooks.has(provider.token)) {
        return;
      }

      this.#registeredSingletonHooks.add(provider.token);

      Object.entries(provider.hooks).forEach(([event, cb]) => {
        const callback = (...args: any[]) => {
          let instance = this.#cache.get(provider.token);

          if (instance === undefined) {
            if (event === "$onDestroy" || this.#resolvingProviders.has(provider.token)) {
              return;
            }

            instance = this.resolve(provider.token);
          }

          return cb(instance, ...args);
        };

        $on(event, provider.token, callback);
      });
    }
  }

  private setToCache(provider: Provider, instance: any) {
    const set = (instance: any) => {
      this.#cache.set(provider.token, instance);
      provider.alias && this.alias(provider.token, provider.alias);
    };

    if ("isAsync" in provider && !provider.isAsync() && !isPromise(instance)) {
      set(instance);

      return instance;
    }

    // store promise to lock token in cache
    set(instance);

    instance = instance.then((instance: any) => {
      set(instance);

      return instance;
    });

    return instance;
  }
}
