import {classOf, deepClone, deepMerge, isArray, isClass, isFunction, isInheritedFrom, isObject, isPromise, nameOf} from "@tsed/core";
import {$alter, $asyncAlter, $asyncEmit, $emit, $off, $on} from "@tsed/hooks";

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
import {DIConfiguration} from "./DIConfiguration.js";

const EXCLUDED_CONFIGURATION_KEYS = ["mount", "imports"];

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
 *
 * await injector().load();
 *
 * const myService1 = injector.get<MyService1>(MyService1);
 * ```
 */
@Injectable({
  scope: ProviderScope.SINGLETON
})
export class InjectorService extends Container {
  public settings: DIConfiguration = new DIConfiguration();
  public logger: DILogger = console;
  private resolvedConfiguration: boolean = false;
  #cache = new LocalsContainer();

  constructor() {
    super();
    this.#cache.set(InjectorService, this);
    this.#cache.set(Configuration, this.settings);
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
   */
  get<T = any>(token: TokenProvider<T>): T | undefined {
    return this.#cache.get(token);
  }

  /**
   * Return all instance of the same provider type
   */
  getMany<Type = any>(type: any, options?: Partial<InvokeOptions>): Type[] {
    return this.getProviders(type).map((provider) => {
      return this.resolve<Type>(provider.token, options);
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
   * Resolve the token depending on his provider configuration.
   *
   * If the token isn't cached, the injector will invoke the provider and cache the result.
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
   * @param options {InvokeOptions} Optional options to invoke the class.
   * @returns {Type} The class constructed.
   */
  public resolve<Type = any>(token: TokenProvider<Type>, options: Partial<InvokeOptions> = {}): Type {
    let instance: any = options.locals ? options.locals.get(token) : undefined;

    if (instance !== undefined) {
      return instance;
    }

    if (token === DI_USE_PARAM_OPTIONS) {
      return options.useOpts as Type;
    }

    instance = !options.rebuild ? this.#cache.get(token) : undefined;

    if (instance != undefined) {
      return instance;
    }

    const provider = this.ensureProvider(token);

    const set = (instance: any) => {
      this.#cache.set(token, instance);
      provider?.alias && this.alias(token, provider.alias);
    };

    if (!provider || options.rebuild) {
      instance = this.invokeToken(token, options);

      if (this.hasProvider(token)) {
        set(instance);
      }

      return instance;
    }

    instance = this.invokeToken(token, options);

    switch (provider.scope) {
      case ProviderScope.SINGLETON:
        if (!options.rebuild) {
          this.registerHooks(provider, options);
        }

        if (!provider.isAsync() || !isPromise(instance)) {
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

      case ProviderScope.REQUEST:
        if (options.locals) {
          options.locals.set(provider.token, instance);

          this.registerHooks(provider, options);
        }

        return instance;
    }

    return instance;
  }

  /**
   * Resolve the token depending on his provider configuration.
   *
   * If the token isn't cached, the injector will invoke the provider and cache the result.
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
   * @param options {InvokeOptions} Optional options to invoke the class.
   * @returns {Type} The class constructed.
   * @alias InjectorService.resolve
   */
  public invoke<Type = any>(token: TokenProvider<Type>, options: Partial<InvokeOptions> = {}): Type {
    return this.resolve(token, options);
  }

  /**
   * Build only providers which are asynchronous.
   */
  async loadAsync() {
    for (const [, provider] of this) {
      if (!this.has(provider.token) && provider.isAsync()) {
        await this.resolve(provider.token);
      }
    }
  }

  /**
   * Build only providers which are synchronous.
   */
  loadSync() {
    for (const [, provider] of this) {
      if (!this.has(provider.token) && provider.scope === ProviderScope.SINGLETON) {
        this.resolve(provider.token);
      }
    }
  }

  /**
   * Build all providers from given container (or GlobalProviders) and emit `$onInit` event.
   *
   * @param container
   */
  async load(container: Container = createContainer()) {
    await $asyncEmit("$beforeInit");

    this.bootstrap(container);

    // build async and sync provider
    await this.loadAsync();

    // load sync provider
    this.loadSync();

    await $asyncEmit("$onInit");
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

    this.resolvedConfiguration = true;
  }

  /**
   * Emit an event to all service. See service [lifecycle hooks](/docs/services.md#lifecycle-hooks).
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
  }

  /**
   * Boostrap injector from container and invokeToken configuration.
   *
   * @param container
   */
  protected bootstrap(container: Container = createContainer()) {
    // Clone all providers in the container
    this.addProviders(container);

    // Resolve all configuration
    this.resolveConfiguration();

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
    if (!this.hasProvider(token) && (GlobalProviders.has(token) || force)) {
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
   * @param options
   * @private
   */
  protected invokeToken<T>(target: TokenProvider, options: Partial<InvokeOptions> = {}): T | Promise<T> {
    const resolvedOpts = this.mapInvokeOptions(target, options);

    if (!resolvedOpts) {
      return undefined as T;
    }

    const {token, deps, construct, imports, provider} = resolvedOpts;

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

          const useOpts = provider?.getArgOpts(index) || options.useOpts;

          return isInheritedFrom(token, Provider, 1)
            ? provider
            : this.resolve(token, {
                parent,
                locals: options.locals,
                useOpts
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

    let provider: Provider;

    if (!this.hasProvider(token)) {
      provider = new Provider(token);
    } else {
      provider = this.getProvider(token)!;
    }

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

      Object.entries(provider.hooks).forEach(([event, cb]) => {
        const callback = (...args: any[]) => {
          return cb(this.#cache.get(provider.token), ...args);
        };

        $on(event, provider.token, callback);
      });
    }
  }
}
