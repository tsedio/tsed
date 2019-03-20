import {Registry, Type} from "@tsed/core";
import {Provider} from "../class/Provider";
import {IProvider, RegistrySettings, TokenProvider, TypedProvidersRegistry} from "../interfaces";

export class GlobalProviderRegistry extends Registry<Provider<any>, IProvider<any>> {
  /**
   * Internal Map
   * @type {Array}
   */
  private _registries: Map<string, RegistrySettings> = new Map();

  constructor() {
    super(Provider);
  }

  /**
   *
   * @param {string} type
   * @param {Type<Provider<any>>} model
   * @param options
   * @returns {Registry<Provider<any>, IProvider<any>>}
   */
  createRegistry(
    type: string,
    model: Type<Provider<any>>,
    options: Partial<RegistrySettings> = {injectable: true}
  ): TypedProvidersRegistry {
    const registry = new Registry<Provider<any>, IProvider<any>>(model, {
      onCreate: this.set.bind(this)
    });

    this._registries.set(
      type,
      Object.assign(
        {
          registry,
          injectable: true
        },
        options
      )
    );

    return registry;
  }

  /**
   *
   * @param {string | TokenProvider} target
   * @returns {RegistrySettings | undefined}
   */
  getRegistrySettings(target: string | TokenProvider): RegistrySettings {
    let type: string = "provider";

    if (typeof target === "string") {
      type = target;
    } else {
      const provider = this.get(target);
      if (provider) {
        type = provider.type;
      }
    }

    if (this._registries.has(type)) {
      return this._registries.get(type)!;
    }

    return {
      registry: this,
      injectable: true
    };
  }

  /**
   *
   * @returns {(provider: (any | IProvider<any>), instance?: any) => void}
   */
  createRegisterFn(type: string) {
    return (provider: any | IProvider<any>, instance?: any): void => {
      if (!provider.provide) {
        provider = {
          provide: provider
        };
      }

      provider = Object.assign({instance}, provider, {type});
      this.getRegistry(type).merge(provider.provide, provider);
    };
  }

  /**
   *
   * @param {string | TokenProvider} target
   * @returns {Registry<Provider<any>, IProvider<any>>}
   */
  getRegistry(target: string | TokenProvider): TypedProvidersRegistry {
    return this.getRegistrySettings(target).registry;
  }
}

/**
 *
 * @type {GlobalProviders}
 */
// tslint:disable-next-line: variable-name
export const GlobalProviders = new GlobalProviderRegistry();
