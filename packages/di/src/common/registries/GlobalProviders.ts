import {getClassOrSymbol, Type} from "@tsed/core";

import {Provider} from "../domain/Provider.js";
import {ProviderType} from "../domain/ProviderType.js";
import {ProviderOpts} from "../interfaces/ProviderOpts.js";
import {RegistrySettings} from "../interfaces/RegistrySettings.js";
import {TokenProvider} from "../interfaces/TokenProvider.js";

export class GlobalProviderRegistry extends Map<TokenProvider, Provider> {
  #settings: Map<TokenProvider, RegistrySettings> = new Map();

  /**
   * The get() method returns a specified element from a Map object.
   * @param key Required. The key of the element to return from the Map object.
   * @returns {T} Returns the element associated with the specified key or undefined if the key can't be found in the Map object.
   */
  get(key: TokenProvider): Provider | undefined {
    return super.get(getClassOrSymbol(key));
  }

  /**
   * The has() method returns a boolean indicating whether an element with the specified key exists or not.
   * @param key
   * @returns {boolean}
   */
  has(key: TokenProvider): boolean {
    return super.has(getClassOrSymbol(key));
  }

  /**
   * The set() method adds or updates an element with a specified key and value to a Map object.
   * @param key Required. The key of the element to add to the Map object.
   * @param metadata Required. The value of the element to add to the Map object.
   */
  set(key: TokenProvider, metadata: Provider): this {
    super.set(getClassOrSymbol(key), metadata);

    return this;
  }

  /**
   *
   * @param target
   * @param options
   */
  merge(target: TokenProvider, options: Partial<ProviderOpts>) {
    if (options.global === false) {
      return GlobalProviders.createProvider(target, options);
    }

    const meta = this.createIfNotExists(target, options);

    Object.keys(options).forEach((key) => {
      meta[key] = (options as never)[key];
    });

    this.set(target, meta);

    return meta;
  }

  /**
   * The delete() method removes the specified element from a Map object.
   * @param key Required. The key of the element to remove from the Map object.
   * @returns {boolean} Returns true if an element in the Map object existed and has been removed, or false if the element does not exist.
   */
  delete(key: TokenProvider): boolean {
    return super.delete(getClassOrSymbol(key));
  }

  createRegistry(type: string | symbol, model: Type<Provider>, options: Partial<RegistrySettings> = {}) {
    const defaultOptions = this.getRegistrySettings(type);

    options = Object.assign(defaultOptions, {
      ...options,
      model
    });

    this.#settings.set(type, options);

    return this;
  }

  getRegistrySettings(target: TokenProvider): RegistrySettings {
    let type: TokenProvider | ProviderType = ProviderType.PROVIDER;

    if (typeof target === "string") {
      type = target;
    } else {
      const provider = this.get(target);
      if (provider) {
        type = provider.type;
      }
    }

    return (
      this.#settings.get(type) || {
        model: Provider
      }
    );
  }

  protected createProvider(key: TokenProvider, options: Partial<ProviderOpts<any>>) {
    const type = options.type || ProviderType.PROVIDER;
    const {model = Provider} = this.#settings.get(type) || {};

    return new model(key, options);
  }

  /**
   *
   * @param key
   * @param options
   */
  protected createIfNotExists(key: TokenProvider, options: Partial<ProviderOpts>): Provider {
    if (!this.has(key)) {
      const item = this.createProvider(key, options);

      this.set(key, item);
    }

    return this.get(key)!;
  }
}

/**
 *
 * @type {GlobalProviders}
 */
// tslint:disable-next-line: variable-name
export const GlobalProviders = new GlobalProviderRegistry();
