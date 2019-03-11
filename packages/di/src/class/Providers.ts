import {Registry, RegistryKey, Type} from "@tsed/core";
import {IProvider, TypedProvidersRegistry} from "../interfaces";
import {RegistrySettings} from "../interfaces/RegistrySettings";
import {Provider} from "./Provider";

export class Providers extends Registry<Provider<any>, IProvider<any>> {
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
  createRegistry(type: string, model: Type<Provider<any>>, options: Partial<RegistrySettings>): TypedProvidersRegistry {
    const registry = new Registry<Provider<any>, IProvider<any>>(model, {
      onCreate: this.set.bind(this)
    });

    this._registries.set(
      type,
      Object.assign(
        {
          registry,
          injectable: true,
          buildable: true
        },
        options
      )
    );

    return registry;
  }

  /**
   *
   * @param {string | RegistryKey} target
   * @returns {RegistrySettings | undefined}
   */
  getRegistrySettings(target: string | RegistryKey): RegistrySettings {
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
      injectable: true,
      buildable: true
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
   * @param {string | RegistryKey} target
   * @returns {Registry<Provider<any>, IProvider<any>>}
   */
  getRegistry(target: string | RegistryKey): TypedProvidersRegistry {
    return this.getRegistrySettings(target).registry;
  }
}
