import {TokenProvider} from "../interfaces/TokenProvider";

export class LocalsContainer<V> extends Map<TokenProvider, V> {
  /**
   * Emit an event to all service. See service [lifecycle hooks](/docs/services.md#lifecycle-hooks).
   * @param eventName The event name to emit at all services.
   * @param args List of the parameters to give to each services.
   * @returns {Promise<any[]>} A list of promises.
   */
  public async emit(eventName: string, ...args: any[]) {
    const instances: any[] = this.toArray();

    for (const instance of instances) {
      if (typeof instance === "object" && instance && eventName in instance) {
        await instance[eventName](...args);
      }
    }
  }

  public alter<T = any>(eventName: string, value: any, ...args: any[]): T {
    const instances: any[] = this.toArray();

    for (const instance of instances) {
      if (typeof instance === "object" && instance && eventName in instance) {
        value = instance[eventName](value, ...args);
      }
    }

    return value;
  }

  public async alterAsync<T = any>(eventName: string, value: any, ...args: any[]): Promise<T> {
    const instances: any[] = this.toArray();

    for (const instance of instances) {
      if (typeof instance === "object" && instance && eventName in instance) {
        value = await instance[eventName](value, ...args);
      }
    }

    return value;
  }

  toArray() {
    return Array.from(this.values());
  }

  async destroy() {
    await this.emit("$onDestroy");
    this.clear();
  }
}
