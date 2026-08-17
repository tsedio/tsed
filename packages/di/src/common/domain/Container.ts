import {Provider} from "./Provider.js";
import type {ProviderOpts} from "../interfaces/ProviderOpts.js";
import type {ProviderType} from "./ProviderType.js";
import type {TokenProvider} from "../interfaces/TokenProvider.js";

/**
 * Provider container managing registered providers and their metadata.
 *
 * Extends `Map` to provide specialized methods for adding, retrieving, and managing providers
 * within the dependency injection system. Acts as a registry for all injectable classes and values.
 *
 * ### Usage
 *
 * ```typescript
 * import {Container} from "@tsed/di";
 *
 * const container = new Container();
 * container.add(MyService, {scope: ProviderScope.SINGLETON});
 *
 * const provider = container.get(MyService);
 * const controllers = container.getMany(ProviderType.CONTROLLER);
 * ```
 *
 * @public
 */
export class Container extends Map<TokenProvider, Provider> {
  /**
   * Add a provider to the
   * @param token
   * @param settings
   */
  public add(token: TokenProvider, settings: Partial<ProviderOpts> = {}): this {
    const provider = Provider.Registry.get(token)?.clone() || new Provider(token);

    Object.assign(provider, settings);

    return super.set(token, provider);
  }

  public override get<T extends Provider = Provider>(token: TokenProvider | undefined): T | undefined {
    return super.get(token!) as T | undefined;
  }

  /**
   * Get all providers registered in the injector container.
   *
   * @param type Filter the list by the given ProviderType.
   * @returns {[TokenProvider , Provider<any>][]}
   */
  public getMany(type?: TokenProvider | ProviderType | string | string[]): Provider[] {
    if (!type) {
      return [...this.values()];
    }

    const types = new Set(([] as (string | ProviderType)[]).concat(type as never).map(String));
    const providers: Provider[] = [];

    for (const [, provider] of this) {
      if (types.has(String(provider.type))) {
        providers.push(provider);
      }
    }

    return providers;
  }

  public merge(container: Map<TokenProvider, Provider>) {
    container.forEach((provider) => {
      if (!super.has(provider.token)) {
        super.set(provider.token, provider.clone());
      }
    });
  }
}
