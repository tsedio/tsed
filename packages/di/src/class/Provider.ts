import {getClass, getClassOrSymbol, nameOf, NotEnumerable, RegistryKey, Store, Type} from "@tsed/core";
import {ProviderScope} from "../interfaces";
import {IProvider} from "../interfaces/IProvider";
import {ProviderType} from "../interfaces/ProviderType";

export class Provider<T> implements IProvider<T> {
  @NotEnumerable()
  protected _useClass: Type<T>;

  @NotEnumerable()
  protected _instance: T;

  @NotEnumerable()
  protected _type: ProviderType | any = ProviderType.PROVIDER;
  protected _provide: RegistryKey;
  @NotEnumerable()
  private _store: Store;

  constructor(provide: RegistryKey) {
    this._provide = getClassOrSymbol(provide);
    this._useClass = getClass(this._provide);
    this._store = Store.from(this._provide);
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
    this._provide = value;
  }

  /**
   *
   * @returns {Type<T>}
   */
  get useClass(): Type<T> {
    return this._useClass;
  }

  /**
   *
   * @param value
   */
  set useClass(value: Type<T>) {
    this._store = Store.from(value);
    this._useClass = value;
  }

  /**
   *
   * @returns {T}
   */
  get instance(): T {
    return this._instance;
  }

  /**
   *
   * @param value
   */
  set instance(value: T) {
    this._instance = value;
  }

  /**
   *
   * @returns {any}
   */
  get type(): any {
    return this._type;
  }

  /**
   *
   * @param value
   */
  set type(value: any) {
    this._type = value;
  }

  /**
   *
   * @returns {string}
   */
  get className() {
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
    return this.store.get("scope");
  }

  /**
   * Change the scope value of the provider.
   * @param scope
   */
  set scope(scope: ProviderScope) {
    this.store.set("scope", scope);
  }

  clone(): Provider<any> {
    const provider = new Provider(this._provide);
    provider._type = this._type;
    provider.useClass = this._useClass;
    provider._instance = this._instance;

    return provider;
  }
}
