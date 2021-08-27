import {TokenProvider} from "../interfaces/TokenProvider";

export class LocalsContainer<V = any> extends Map<TokenProvider, V> {
  /**
   * Emit an event to all service. See service [lifecycle hooks](/docs/services.md#lifecycle-hooks).
   * @param eventName The event name to emit at all services.
   * @param args List of the parameters to give to each services.
   * @returns {Promise<any[]>} A list of promises.
   */
  public async emit(eventName: string, ...args: any[]) {
    for (const [, instance] of this) {
      if (instance && (instance as any)[eventName]) {
        await (instance as any)[eventName](...args);
      }
    }
  }

  public alter<T = any>(eventName: string, value: any, ...args: any[]): T {
    for (const [, instance] of this) {
      if (instance && (instance as any)[eventName]) {
        value = (instance as any)[eventName](value, ...args);
      }
    }

    return value;
  }

  public async alterAsync<T = any>(eventName: string, value: any, ...args: any[]): Promise<T> {
    for (const [, instance] of this) {
      if (instance && (instance as any)[eventName]) {
        value = await (instance as any)[eventName](value, ...args);
      }
    }

    return value;
  }

  toArray() {
    return [...this.values()];
  }

  async destroy() {
    await this.emit("$onDestroy");
    this.clear();
  }
}
