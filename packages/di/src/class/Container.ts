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
}
