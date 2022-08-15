export class Hooks {
  #listeners: Map<string, Function[]> = new Map();

  /**
   * Listen a hook event
   * @param event
   * @param cb
   */
  on(event: string, cb: Function) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, []);
    }

    this.#listeners.get(event)!.push(cb);

    return this;
  }

  /**
   * Remove a listener attached to an event
   * @param event
   * @param cb
   */
  off(event: string, cb: Function) {
    if (this.#listeners.has(event)) {
      this.#listeners.set(
        event,
        this.#listeners.get(event)!.filter((item) => item === cb)
      );
    }

    return this;
  }

  /**
   * Trigger an event and call listener.
   * @param event
   * @param args
   * @param callThis
   */
  emit(event: string, args: any[] = [], callThis: any = null): void {
    const listeners = this.#listeners.get(event);

    if (listeners?.length) {
      for (const cb of listeners) {
        cb.call(callThis, ...args);
      }
    }
  }

  /**
   * Trigger an event, listener alter given value and return it.
   * @param event
   * @param value
   * @param args
   * @param callThis
   */
  alter(event: string, value: any, args: any[] = [], callThis: any = null): any {
    const listeners = this.#listeners.get(event);

    if (listeners?.length) {
      for (const cb of listeners) {
        value = cb.call(callThis, value, ...args);
      }
    }

    return value;
  }

  /**
   * Trigger an event and call async listener.
   * @param event
   * @param args
   * @param callThis
   */
  async asyncEmit(event: string, args: any[] = [], callThis: any = null): Promise<void> {
    const listeners = this.#listeners.get(event);

    if (listeners?.length) {
      const promises = listeners.map((cb) => cb.call(callThis, ...args));

      await Promise.all(promises);
    }
  }

  /**
   * Trigger an event, async listener alter given value and return it.
   * @param event
   * @param value
   * @param args
   * @param callThis
   */
  async asyncAlter(event: string, value: any, args: any[] = [], callThis: any = null): Promise<any> {
    const listeners = this.#listeners.get(event);

    if (listeners?.length) {
      for (const cb of listeners) {
        value = await cb.call(callThis, value, ...args);
      }
    }

    return value;
  }

  destroy() {
    this.#listeners.clear();
  }
}
