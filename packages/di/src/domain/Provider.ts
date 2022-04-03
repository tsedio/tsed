import {classOf, getClassOrSymbol, isClass, nameOf, Store, Type} from "@tsed/core";
import {ProviderOpts} from "../interfaces/ProviderOpts";
import {TokenProvider} from "../interfaces/TokenProvider";
import {ProviderScope} from "./ProviderScope";
import {ProviderType} from "./ProviderType";

export class Provider<T = any> implements ProviderOpts<T> {
  public type: ProviderType | any = ProviderType.PROVIDER;
  /**
   * @deprecated Use injector.get(provider.token) instead.
   */
  public instance: T;
  public deps: TokenProvider[];
  public imports: any[];
  public useFactory: Function;
  public useAsyncFactory: Function;
  public useValue: any;
  private _useClass: Type<T>;
  private _provide: TokenProvider;
  private _store: Store;
  private _tokenStore: Store;

  [key: string]: any;

  constructor(token: TokenProvider, options: Partial<Provider> = {}) {
    this.provide = token;
    this.useClass = token;

    Object.assign(this, options);
  }

  get token() {
    return this._provide;
  }

  get provide(): TokenProvider {
    return this._provide;
  }

  set provide(value: TokenProvider) {
    if (value) {
      this._provide = getClassOrSymbol(value);
      this._tokenStore = this._store = Store.from(value);
    }
  }

  get useClass(): Type<T> {
    return this._useClass;
  }

  /**
   * Create a new store if the given value is a class. Otherwise the value is ignored.
   * @param value
   */
  set useClass(value: Type<T>) {
    if (isClass(value)) {
      this._useClass = classOf(value);
      this._store = Store.from(value);
    }
  }

  get className() {
    return this.name;
  }

  get name() {
    return nameOf(this.provide);
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

    return this.get("scope");
  }

  /**
   * Change the scope value of the provider.
   * @param scope
   */
  set scope(scope: ProviderScope) {
    this.store.set("scope", scope);
  }

  get configuration(): Partial<TsED.Configuration> {
    return this.get("configuration");
  }

  set configuration(configuration: Partial<TsED.Configuration>) {
    this.store.set("configuration", configuration);
  }

  get children(): TokenProvider[] {
    return this.store.get("childrenControllers", []);
  }

  get(key: string) {
    return this.store.get(key) || this._tokenStore.get(key);
  }

  isAsync(): boolean {
    return !!this.useAsyncFactory;
  }

  clone(): Provider {
    return new (classOf(this))(this._provide, this);
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
