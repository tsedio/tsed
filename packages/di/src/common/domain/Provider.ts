import {type AbstractType, classOf, getClassOrSymbol, isClass, nameOf, Store, Type} from "@tsed/core";

import {DI_USE_PARAM_OPTIONS} from "../constants/constants.js";
import type {ProviderOpts} from "../interfaces/ProviderOpts.js";
import type {TokenProvider} from "../interfaces/TokenProvider.js";
import {discoverHooks} from "../utils/discoverHooks.js";
import {ProviderScope} from "./ProviderScope.js";
import {ProviderType} from "./ProviderType.js";

export type ProviderHookCallback<T = any> = (instance: T, ...args: unknown[]) => Promise<void> | void;

export class Provider<T = any> implements ProviderOpts<T> {
  /**
   * Token group provider to retrieve all provider from the same type
   */
  public type: ProviderType | TokenProvider = ProviderType.PROVIDER;
  public deps: TokenProvider[];
  public imports: (TokenProvider | [TokenProvider])[];
  public alias: string;
  public priority: number;
  public useFactory?: Function;
  public useAsyncFactory?: Function;
  public useValue?: unknown;
  public hooks: Record<string, ProviderHookCallback<T>> = {};
  private _useClass: Type<T>;
  private _token: TokenProvider;
  private _store: Store;
  private _tokenStore: Store;

  [key: string]: any;

  constructor(token: TokenProvider<T>, options: Partial<Provider> = {}) {
    this.token = token;
    this.useClass = token as Type<T>;

    Object.assign(this, options);
  }

  get token() {
    return this._token;
  }

  set token(value: TokenProvider) {
    if (value) {
      this._token = getClassOrSymbol(value);
      this._tokenStore = this._store = Store.from(value);
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

  get useClass(): Type<T> {
    return this._useClass;
  }

  /**
   * Create a new store if the given value is a class. Otherwise, the value is ignored.
   * @param value
   */
  set useClass(value: Type<T> | AbstractType<T>) {
    if (isClass(value)) {
      this._useClass = classOf(value);
      this._store = Store.from(value);
      this.hooks = discoverHooks(this._useClass);
    }
  }

  get className() {
    return this.name;
  }

  get name() {
    return nameOf(this.token);
  }

  get store(): Store {
    return this._store;
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

  get configuration(): Partial<TsED.Configuration> {
    return this.get("configuration")!;
  }

  set configuration(configuration: Partial<TsED.Configuration>) {
    this.store.set("configuration", configuration);
  }

  get children(): TokenProvider[] {
    return this.store.get("childrenControllers", []);
  }

  set children(children: TokenProvider[]) {
    this.store.set("childrenControllers", children);
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
    return this.store.get(key) || this._tokenStore.get(key) || defaultValue;
  }

  isAsync(): boolean {
    return !!this.useAsyncFactory;
  }

  clone(): Provider {
    return new (classOf(this))(this.token, this);
  }

  /**
   *
   * @returns {boolean}
   */
  public hasChildren(): boolean {
    return !!this.children.length;
  }

  /**
   *
   * @returns {boolean}
   */
  public hasParent(): boolean {
    return !!this.store.get("parentController");
  }

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
}
