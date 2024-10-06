import type {ProviderOpts} from "../interfaces/ProviderOpts.js";
import type {TokenProvider} from "../interfaces/TokenProvider.js";
import {GlobalProviders} from "../registries/GlobalProviders.js";
import {Provider} from "./Provider.js";
import type {ProviderType} from "./ProviderType.js";

export class Container extends Map<TokenProvider, Provider> {
  /**
   *
   * @param token
   * @param settings
   */
  public add(token: TokenProvider, settings: Partial<ProviderOpts> = {}): this {
    const provider = GlobalProviders.get(token)?.clone() || new Provider(token);

    Object.assign(provider, settings);

    return super.set(token, provider);
  }

  /**
   * Add a provider to the
   * @param token
   * @param settings
   */
  public addProvider(token: TokenProvider, settings: Partial<ProviderOpts> = {}): this {
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
  public setProvider(token: TokenProvider, provider: Provider) {
    return super.set(token, provider);
  }

  /**
   * The getProvider() method returns a specified element from a Map object.
   * @returns {T} Returns the element associated with the specified key or undefined if the key can't be found in the Map object.
   * @param token
   */
  public getProvider<T extends Provider = Provider>(token: TokenProvider | undefined): T | undefined {
    return super.get(token!) as T;
  }

  /**
   * Get all providers registered in the injector container.
   *
   * @param type Filter the list by the given ProviderType.
   * @returns {[TokenProvider , Provider<any>][]}
   */
  public getProviders(type?: TokenProvider | ProviderType | string | string[]): Provider[] {
    const types = ([] as (string | ProviderType)[]).concat(type as never).map(String);

    return [...this].reduce((providers, [_, provider]) => {
      if (types.includes(String(provider.type)) || !type) {
        return [...providers, provider];
      }
      return providers;
    }, []);
  }

  public addProviders(container: Map<TokenProvider, Provider>) {
    container.forEach((provider) => {
      if (!this.hasProvider(provider.provide)) {
        this.setProvider(provider.provide, provider.clone());
      }
    });
  }
}
