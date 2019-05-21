import {Enumerable, getClass, getKeys, isClass, nameOf, NotEnumerable, Store, Type} from "@tsed/core";
import {ProviderScope} from "../interfaces";
import {IProvider} from "../interfaces/IProvider";
import {ProviderType} from "../interfaces/ProviderType";
import {TokenProvider} from "../interfaces/TokenProvider";

export class Provider<T> implements IProvider<T> {
  /**
   *
   */
  @Enumerable()
  public type: ProviderType | any = ProviderType.PROVIDER;
  /**
   *
   */
  @Enumerable()
  public injectable: boolean = true;
  /**
   *
   */
  @Enumerable()
  public instance: T;
  /**
   *
   */
  @Enumerable()
  public deps: any[];
  /**
   *
   */
  @Enumerable()
  public useFactory: Function;
  /**
   *
   */
  @Enumerable()
  public useValue: any;
  /**
   *
   */
  @NotEnumerable()
  protected _provide: TokenProvider;
  /**
   *
   */
  @NotEnumerable()
  protected _useClass: Type<T>;
  /**
   *
   */
  @NotEnumerable()
  protected _instance: T;
  /**
   *
   */
  @NotEnumerable()
  protected _scope: ProviderScope;
  /**
   *
   */
  @NotEnumerable()
  private _store: Store;

  [key: string]: any;

  constructor(token: TokenProvider) {
    this.provide = token;
    this.useClass = token;
  }

  /**
   *
   * @returns {any}
   */
  get provide(): any {
    return this._provide;
  }

  /**
   *
   * @param value
   */
  set provide(value: any) {
    this._provide = isClass(value) ? getClass(value) : value;
  }

  /**
   *
   * @returns {Type<T>}
   */
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
      this._useClass = getClass(value);
      this._store = Store.from(value);
    }
  }

  /**
   *
   * @returns {string}
   */
  get className() {
    return this.name;
  }

  /**
   *
   */
  get name() {
    return nameOf(this.provide);
  }

  /**
   *
   * @returns {Store}
   */
  public get store(): Store {
    return this._store;
  }

  /**
   * Get the scope of the provider.
   * @returns {boolean}
   */
  get scope(): ProviderScope {
    return this._store ? this.store.get("scope") : this._scope;
  }

  /**
   * Change the scope value of the provider.
   * @param scope
   */
  @Enumerable()
  set scope(scope: ProviderScope) {
    this._store ? this.store.set("scope", scope) : this._scope;
  }

  /**
   *
   */
  clone(): Provider<any> {
    const provider = new (getClass(this))(this.provide);

    getKeys(this).forEach(key => {
      provider[key] = this[key];
    });

    return provider;
  }

  toString() {
    return `Token:${this.name}`;
  }
}
