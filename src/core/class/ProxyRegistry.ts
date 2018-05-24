import {ProxyMap} from "./ProxyMap";
import {Registry, RegistryKey} from "./Registry";
/**
 * @private
 */
export abstract class ProxyRegistry<T, I> extends ProxyMap<RegistryKey, T> {
  constructor(protected registry: Registry<T, I>) {
    super(registry);
  }

  set(key: RegistryKey, value: T): this {
    this.registry.merge(key, value);

    return this;
  }
}
