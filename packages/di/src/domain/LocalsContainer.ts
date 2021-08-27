import {TokenProvider} from "../interfaces/TokenProvider";

export class LocalsContainer<V = any> extends Map<TokenProvider, V> {
  /**
   * Emit an event to all service. See service [lifecycle hooks](/docs/services.md#lifecycle-hooks).
   * @param eventName The event name to emit at all services.
   * @param args List of the parameters to give to each services.
   * @returns {Promise<any[]>} A list of promises.
   */
  public async emit(eventName: string, ...args: any[]) {
    for (const handler of this.getListeners(eventName)) {
      await handler(...args);
    }
  }

  /**
   * @param eventName
   * @param value
   * @param args
   */
  public alter<T = any>(eventName: string, value: any, ...args: any[]): T {
    for (const handler of this.getListeners(eventName)) {
      value = handler(value, ...args);
    }

    return value;
  }

  /**
   * @param eventName
   * @param value
   * @param args
   */
  public async alterAsync<T = any>(eventName: string, value: any, ...args: any[]): Promise<T> {
    for (const handler of this.getListeners(eventName)) {
      value = handler(value, ...args);
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

  protected getListeners(event: string): any[] {
    return this.toArray().reduce((listeners, instance) => {
      if (typeof instance === "object" && instance && event in instance) {
        return listeners.concat((instance as any)[event].bind(instance));
      }

      return listeners;
    }, []);
  }
}
