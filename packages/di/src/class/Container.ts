import {IProvider} from "../interfaces/IProvider";
import {ProviderType} from "../interfaces/ProviderType";
import {TokenProvider} from "../interfaces/TokenProvider";
import {GlobalProviders} from "../registries/GlobalProviders";
import {LocalsContainer} from "./LocalsContainer";
import {Provider} from "./Provider";

export class Container extends LocalsContainer<Provider<any>> {
  /**
   *
   * @param token
   * @param settings
   */
  public add(token: TokenProvider, settings: Partial<IProvider<any>> = {}): this {
    const provider = GlobalProviders.has(token) ? GlobalProviders.get(token)!.clone() : new Provider(token);

    Object.assign(provider, settings);

    return super.set(token, provider);
  }

  /**
   * Add a provider to the
   * @param token
   * @param settings
   */
  public addProvider(token: TokenProvider, settings: Partial<IProvider<any>> = {}): this {
    return this.add(token, settings);
  }

  /**
   *
   * @param token
   */
  public hasProvider(token: TokenProvider) {
    return super.has(token);
  }

  /**
   * Add a provider to the
   * @param token
   * @param provider
   */
  public setProvider(token: TokenProvider, provider: Provider<any>) {
    return super.set(token, provider);
  }

  /**
   * The getProvider() method returns a specified element from a Map object.
   * @returns {T} Returns the element associated with the specified key or undefined if the key can't be found in the Map object.
   * @param token
   */
  public getProvider(token: TokenProvider): Provider<any> | undefined {
    return super.get(token);
  }

  /**
   * Get all providers registered in the injector container.
   *
   * @param {ProviderType} type Filter the list by the given ProviderType.
   * @returns {[RegistryKey , Provider<any>][]}
   */
  public getProviders(type?: ProviderType | string): Provider<any>[] {
    return Array.from(this)
      .filter(([key, provider]) => (type ? provider.type === type : true))
      .map(([key, provider]) => provider);
  }

  public addProviders(container: Map<TokenProvider, Provider<any>>) {
    container.forEach(provider => {
      if (!this.hasProvider(provider.provide) && !provider.root) {
        this.setProvider(provider.provide, provider.clone());
      }
    });
  }
}
