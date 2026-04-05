import {Store} from "@tsed/core/types/Store.js";
import type {AbstractType, Type} from "@tsed/core/types/Type.js";
import {classOf} from "@tsed/core/utils/classOf.js";
import {getClassOrSymbol} from "@tsed/core/utils/getClassOrSymbol.js";
import {isClass} from "@tsed/core/utils/isClass.js";
import {nameOf} from "@tsed/core/utils/nameOf.js";

import {DI_USE_PARAM_OPTIONS} from "../constants/constants.js";
import type {ProviderOpts} from "../interfaces/ProviderOpts.js";
import type {TokenProvider} from "../interfaces/TokenProvider.js";
import {discoverHooks} from "../utils/discoverHooks.js";
import {ProviderScope} from "./ProviderScope.js";
import {ProviderType} from "./ProviderType.js";

/**
 * Middleware configuration for a controller.
 *
 * Defines middleware tokens to be applied at different stages of request processing.
 *
 * @public
 */
export interface ControllerMiddlewares {
  useBefore: TokenProvider[];
  use: TokenProvider[];
  useAfter: TokenProvider[];
}

/**
 * Callback function type for provider lifecycle hooks.
 *
 * @typeParam T - The type of provider instance
 * @public
 */
export type ProviderHookCallback<T = any> = (instance: T, ...args: unknown[]) => Promise<void> | void;

/**
 * Provider metadata class managing dependency injection configuration.
 *
 * Encapsulates all information needed to create, configure, and manage a provider instance
 * within the DI container. Tracks dependencies, lifecycle hooks, creation strategies, and metadata.
 *
 * ### Usage
 *
 * ```typescript
 * import {Provider, ProviderType} from "@tsed/di";
 *
 * const provider = new Provider(MyService);
 * provider.type = ProviderType.PROVIDER;
 * provider.deps = [DatabaseService, LoggerService];
 * ```
 *
 * @typeParam T - The type of instance this provider creates
 * @public
 */
export class Provider<T = any> implements ProviderOpts<T> {
  /**
   * Global registry for storing all providers in the dependency injection system.
   * Maps provider tokens to their Provider instances.
   */
  static readonly Registry = new Map<TokenProvider, Provider>();

  /**
   * Token group provider to retrieve all providers from the same type
   */
  public type: ProviderType | TokenProvider = ProviderType.PROVIDER;

  /**
   * Array of token providers that this provider depends on
   */
  public deps!: TokenProvider[];

  /**
   * Array of providers or provider arrays to be imported
   */
  public imports!: (TokenProvider | [TokenProvider])[];

  /**
   * Alternative name/alias for this provider
   */
  public alias!: string;

  /**
   * Priority value affecting the order of provider initialization
   */
  public priority!: number;

  /**
   * Optional factory function to create provider instances
   */
  public useFactory?: Function;

  /**
   * Optional async factory function to create provider instances
   */
  public useAsyncFactory?: Function;

  /**
   * Optional static value to use instead of creating instances
   */
  public useValue?: unknown;

  /**
   * Map of lifecycle hook callbacks for this provider
   */
  public hooks: Record<string, ProviderHookCallback<T>> = {};

  /**
   * Router token for routing-related providers
   */
  public tokenRouter!: string;
  /**
   * The class type used to instantiate this provider
   */
  #useClass!: Type<T>;

  /**
   * The token used to identify this provider
   */
  #token!: TokenProvider;

  /**
   * Store instance for provider metadata
   */
  #store!: Store;

  /**
   * Store instance for token-specific metadata
   */
  #tokenStore!: Store;

  [key: string]: any;

  /**
   * Creates a new Provider instance
   * @param token - The token used to identify this provider
   * @param options - Optional configuration options for the provider
   */
  constructor(token: TokenProvider<T>, options: Partial<Provider> = {}) {
    this.token = token;
    this.useClass = token as Type<T>;

    Object.assign(this, options);

    if (options instanceof Provider) {
      this.#useClass = options.#useClass;
      this.#store = options.#store;
      this.#tokenStore = options.#tokenStore;
    }
  }

  /**
   * Get the provider's token
   */
  get token() {
    return this.#token;
  }

  /**
   * Set the provider's token and initialize stores
   * @param value - The token to set
   */
  set token(value: TokenProvider) {
    if (value) {
      this.#token = getClassOrSymbol(value);
      this.#tokenStore = this.#store = Store.from(value);
    }
  }

  /**
   * @deprecated
   */
  get provide(): TokenProvider {
    return this.token;
  }

  /**
   * @deprecated
   * @param value
   */
  set provide(value: TokenProvider) {
    this.token = value;
  }

  /**
   * Gets the class type used to instantiate this provider
   */
  get useClass(): Type<T> {
    return this.#useClass;
  }

  /**
   * Sets the class type and initializes store/hooks for this provider
   * @param value - The class type to use for instantiation
   */
  set useClass(value: Type<T> | AbstractType<T>) {
    if (isClass(value)) {
      this.#useClass = classOf(value);
      this.#store = Store.from(value);
      this.hooks = discoverHooks(this.#useClass);
    }
  }

  get className() {
    return this.name;
  }

  get name() {
    return nameOf(this.token);
  }

  get store(): Store {
    return this.#store;
  }

  get path() {
    return this.store.get("path", "/");
  }

  set path(path: string) {
    this.store.set("path", path);
  }

  /**
   * Get the scope of the provider.
   *
   * ::: tip Note
   * Async provider is always a SINGLETON
   * :::
   *
   * @returns {boolean}
   */
  get scope(): ProviderScope {
    if (this.isAsync()) {
      return ProviderScope.SINGLETON;
    }

    return this.get<ProviderScope>("scope", ProviderScope.SINGLETON);
  }

  /**
   * Change the scope value of the provider.
   * @param scope
   */
  set scope(scope: ProviderScope) {
    this.store.set("scope", scope);
  }

  /**
   * Gets the provider configuration settings
   */
  get configuration(): Partial<TsED.Configuration> {
    return this.get("configuration")!;
  }

  /**
   * Sets the provider configuration settings
   * @param configuration - The configuration object to set
   */
  set configuration(configuration: Partial<TsED.Configuration>) {
    this.store.set("configuration", configuration);
  }

  get children(): TokenProvider[] {
    return this.store.get("childrenControllers", []);
  }

  set children(children: TokenProvider[]) {
    this.store.set("childrenControllers", children);
  }

  /**
   * Gets the configured middleware stack for this provider
   */
  get middlewares(): Partial<ControllerMiddlewares> {
    return Object.assign(
      {
        use: [],
        useAfter: [],
        useBefore: []
      },
      this.store.get("middlewares", {})
    );
  }

  /**
   * Sets middleware configuration, merging with existing middlewares
   * @param middlewares - The middleware configuration to apply
   */
  set middlewares(middlewares: Partial<ControllerMiddlewares>) {
    const mdlwrs = this.middlewares;
    const concat = (key: string, a: any, b: any) => (a[key] = a[key].concat(b[key]));

    Object.keys(middlewares).forEach((key: string) => {
      concat(key, mdlwrs, middlewares);
    });

    this.store.set("middlewares", mdlwrs);
  }

  getArgOpts(index: number) {
    return this.store.get(`${DI_USE_PARAM_OPTIONS}:${index}`);
  }

  /**
   * Retrieves a value from the provider's store.
   * @param key The key to look up
   * @returns The value if found, undefined otherwise
   */
  get<Type = unknown>(key: string): Type | undefined;
  /**
   * Retrieves a value from the provider's store with a default fallback.
   * @param key The key to look up
   * @param defaultValue The value to return if key is not found
   * @returns The found value or defaultValue
   */
  get<Type = unknown>(key: string, defaultValue: Type): Type;
  get<Type = unknown>(key: string, defaultValue?: Type): Type | undefined {
    return this.store.get(key) || this.#tokenStore.get(key) || defaultValue;
  }

  isAsync(): boolean {
    return !!this.useAsyncFactory;
  }

  clone(): Provider {
    return new (classOf(this))(this.token, this);
  }

  /**
   * Checks if this provider has any child controllers
   * @returns True if provider has children, false otherwise
   */
  public hasChildren(): boolean {
    return !!this.children.length;
  }

  /**
   * Checks if this provider has a parent controller
   * @returns True if provider has a parent, false otherwise
   */
  public hasParent(): boolean {
    return !!this.store.get("parentController");
  }

  /**
   * Returns a string representation of this provider
   * @returns A string containing the provider's token, class and factory information
   */
  toString() {
    return [
      "Token",
      this.name,
      this.useClass && nameOf(this.useClass),
      this.useFactory && "Factory",
      this.useValue && "Value",
      this.useAsyncFactory && "AsyncFactory"
    ]
      .filter(Boolean)
      .join(":");
  }

  /**
   * Resets the provider's factory configuration
   * Clears useValue, useFactory and useAsyncFactory
   * @returns This provider instance
   */
  reset() {
    this.useValue = undefined;
    this.useFactory = undefined;
    this.useAsyncFactory = undefined;

    return this;
  }
}
