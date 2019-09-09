import {classOf, Enumerable, getKeys, isClass, nameOf, NotEnumerable, Store, Type} from "@tsed/core";
import {IDIConfigurationOptions, ProviderScope} from "../interfaces";
import {IProvider} from "../interfaces/IProvider";
import {ProviderType} from "../interfaces/ProviderType";
import {TokenProvider} from "../interfaces/TokenProvider";

export class Provider<T> implements IProvider<T> {
  @Enumerable()
  public root: boolean = false;

  @Enumerable()
  public type: ProviderType | any = ProviderType.PROVIDER;

  @Enumerable()
  public injectable: boolean = true;

  @Enumerable()
  public instance: T;

  @Enumerable()
  public deps: any[];

  @Enumerable()
  public imports: any[];

  @Enumerable()
  public useFactory: Function;

  @Enumerable()
  public useAsyncFactory: Function;

  @Enumerable()
  public useValue: any;

  @NotEnumerable()
  protected _provide: TokenProvider;

  @NotEnumerable()
  protected _useClass: Type<T>;

  @NotEnumerable()
  protected _instance: T;

  @NotEnumerable()
  private _store: Store;

  [key: string]: any;

  constructor(token: TokenProvider) {
    this.provide = token;
    this.useClass = token;
  }

  get token() {
    return this._provide;
  }

  get provide(): TokenProvider {
    return this._provide;
  }

  set provide(value: TokenProvider) {
    if (value) {
      this._provide = isClass(value) ? classOf(value) : value;
      this._store = Store.from(value);
    }
  }

  get useClass(): Type<T> {
    return this._useClass;
  }

  /**
   * Create a new store if the given value is a class. Otherwise the value is ignored.
   * @param value
   */
  @Enumerable()
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
    if (this.isAsync()) {
      return ProviderScope.SINGLETON;
    }

    return this.store.get("scope");
  }

  /**
   * Change the scope value of the provider.
   * @param scope
   */
  @Enumerable()
  set scope(scope: ProviderScope) {
    this.store.set("scope", scope);
  }

  get configuration(): Partial<IDIConfigurationOptions> {
    return this.store.get("configuration");
  }

  @Enumerable()
  set configuration(configuration: Partial<IDIConfigurationOptions>) {
    this.store.set("configuration", configuration);
  }

  isAsync(): boolean {
    return !!this.useAsyncFactory;
  }

  clone(): Provider<any> {
    const provider = new (classOf(this))(this.token);

    getKeys(this).forEach(key => {
      if (this[key] !== undefined) {
        provider[key] = this[key];
      }
    });

    return provider;
  }

  toString() {
    return `Token:${this.name}`;
  }
}
