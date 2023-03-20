import {Engine, ViewEngineOptions} from "../components/Engine";

export interface EngineProvider {
  name: string;
  useClass: typeof Engine;
  instance?: Engine;
  options: ViewEngineOptions;
}

export class EnginesContainer {
  #providers: Map<string | typeof Engine, EngineProvider> = new Map();

  has(key: string | typeof Engine) {
    return this.#providers.has(key);
  }

  get(key: string | typeof Engine) {
    const provider = this.#providers.get(key);

    if (provider && !provider.instance) {
      provider.instance = new provider.useClass(provider.name, provider.options);
    }

    return provider?.instance;
  }

  set(key: typeof Engine, provider: EngineProvider) {
    this.#providers.set(key, provider);
    this.#providers.set(provider.name, provider);
  }

  getSupportedEngines(): string[] {
    const keys: string[] = [];

    this.#providers.forEach((value, key) => {
      typeof key === "string" && keys.push(key);
    });

    return keys;
  }
}

export const engines = new EnginesContainer();
