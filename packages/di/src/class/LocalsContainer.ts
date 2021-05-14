import {TokenProvider} from "../interfaces/TokenProvider";

export class LocalsContainer<V> extends Map<TokenProvider, V> {
  #events: Map<string, any> = new Map();

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

  public alter<T = any>(eventName: string, value: any, ...args: any[]): T {
    for (const handler of this.getListeners(eventName)) {
      value = handler(value, ...args);
    }

    return value;
  }

  public async alterAsync<T = any>(eventName: string, value: any, ...args: any[]): Promise<T> {
    for (const handler of this.getListeners(eventName)) {
      value = handler(value, ...args);
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

  protected getListeners(event: string): any[] {
    if (!this.#events.has(event)) {
      const listeners: any = [];

      this.toArray().forEach((instance: any) => {
        if (typeof instance === "object" && instance && event in instance) {
          listeners.push(instance[event].bind(instance));
        }
      });

      this.#events.set(event, listeners);
    }

    return this.#events.get(event);
  }
}
