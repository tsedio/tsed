import {classOf, getClassOrSymbol, isClass, Metadata, nameOf, Store, Type} from "@tsed/core";
import {IProvider, TokenProvider} from "../interfaces";
import {ProviderScope} from "./ProviderScope";
import {ProviderType} from "./ProviderType";

export class Provider<T = any> implements IProvider<T> {
  public type: ProviderType | any = ProviderType.PROVIDER;
  public instance: T;
  public deps: TokenProvider[];
  public imports: any[];

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

  public get store(): Store {
    return this._store;
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

  getDeps() {
    if (this.deps) {
      return this.deps;
    }

    if (this.useValue !== undefined || this.useFactory || this.useAsyncFactory) {
      return [];
    }

    return Metadata.getParamTypes(this.useClass);
  }

  isAsync(): boolean {
    return false;
  }

  get(key: string) {
    return this.store.get(key) || this._tokenStore.get(key);
  }

  clone(): Provider {
    return new (classOf(this))(this._provide, this);
  }

  construct(deps: TokenProvider[]) {
    return new this.useClass(...deps);
  }

  toString() {
    return ["Token", this.name, this.useClass && nameOf(this.useClass)].filter(Boolean).join(":");
  }
}
