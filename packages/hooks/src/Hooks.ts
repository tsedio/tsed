export type HookRef = string | symbol | any | Function;
export type HookListener = Function;

type HookItem = {cb: HookListener; ref?: HookRef};

function match(ref: HookRef | unknown[] | undefined, item: HookItem) {
  return !ref || !item.ref || (ref && item.ref === ref);
}

export class Hooks {
  #listeners: Map<string, HookItem[]> = new Map();

  /**
   * Check if an event has listeners
   * @param event
   */
  has(event: string) {
    return !!this.#listeners.get(event)?.length;
  }

  /**
   * Listen a hook event
   * @param event The event name
   * @param ref The reference of the listener
   * @param cb The callback
   */
  on(event: string, ref: HookRef, cb: HookListener): this;
  /**
   * Listen a hook event
   * @param event The event name
   * @param cb The callback
   */
  on(event: string, cb: HookListener): this;
  on(event: string, cbORef: HookRef | HookListener, cb?: HookListener) {
    let ref: HookRef | HookListener | undefined = cbORef;

    if (!cb) {
      cb = ref as HookListener;
      ref = undefined;
    }

    const items = this.#listeners.get(event) || [];

    items.push({
      cb,
      ref
    });

    this.#listeners.set(event, items);

    return this;
  }

  /**
   * Listen a hook event once
   *
   * @param event The event name
   * @param ref The reference of the listener
   * @param cb The callback
   */
  once(event: string, ref: HookRef, cb: HookListener): this;
  /**
   * Listen a hook event once
   * @param event
   * @param cb
   */
  once(event: string, cb: HookListener): this;
  once(event: string, ref: HookRef | HookListener, cb?: HookListener) {
    if (!cb) {
      cb = ref as HookListener;
    }

    const onceCb = (...args: unknown[]) => {
      cb(...args);
      this.off(event, onceCb);
    };

    this.on(event, ref, onceCb);

    return this;
  }

  /**
   * Remove a listener attached to an event
   * @param ref
   */
  off(ref: HookRef): this;
  /**
   * Remove a listener attached to an event
   * @param event
   * @param cb
   */
  off(event: string, cb: HookListener): this;
  off(event: string | HookRef, cb?: HookListener) {
    const set = (event: string, items: HookItem[]) => {
      if (items.length) {
        this.#listeners.set(event, items);
      } else {
        this.#listeners.delete(event);
      }
    };

    if (typeof event === "string" && cb) {
      let items = this.#listeners.get(event);

      if (items) {
        set(
          event,
          items.filter((item) => item.cb !== cb)
        );
      }
    } else {
      const ref = event as HookRef;

      this.#listeners.forEach((items, event) => {
        set(
          event,
          items.filter((item) => item.ref !== ref)
        );
      });
    }

    return this;
  }

  /**
   * Trigger an event without arguments.
   * @param event The event name
   */
  emit(event: string): void;
  /**
   * Trigger an event and call listener.
   * @param event
   * @param args
   * @param callThis
   */
  emit(event: string, args: unknown[]): void;
  /**
   * Trigger an event with arguments and call only listener attached to the given ref.
   * @param event The event name
   * @param ref The reference of the listener
   * @param args The arguments
   */
  emit(event: string, ref: HookRef, args?: unknown[]): void;
  emit(event: string, ref?: HookRef | unknown[], args?: unknown[]): void {
    if (Array.isArray(ref)) {
      args = ref;
      ref = undefined;
    }

    args ||= [];

    const items = this.#listeners.get(event);

    if (items?.length) {
      for (const item of items) {
        if (match(ref, item)) {
          item.cb.apply(null, args);
        }
      }
    }
  }

  /**
   * Trigger an event and call async listener.
   * @param event The event name
   */
  async asyncEmit(event: string): Promise<void>;
  async asyncEmit(event: string, args: unknown[]): Promise<void>;
  async asyncEmit(event: string, ref: HookRef, args?: unknown[]): Promise<void>;
  async asyncEmit(event: string, ref?: HookRef | unknown[], args?: unknown[]): Promise<void> {
    if (Array.isArray(ref)) {
      args = ref;
      ref = undefined;
    }

    const items = this.#listeners.get(event);

    if (items?.length) {
      const promises = items.filter((item) => match(ref, item)).map((item) => item.cb.apply(null, args));

      await Promise.all(promises);
    }
  }

  /**
   * Trigger an event, listener alter given value and return it.
   * @param event
   * @param value
   * @param args
   * @param callThis
   */
  alter<Arg = unknown, AlteredArg = Arg>(event: string, value: Arg, args: unknown[] = [], callThis: unknown = null): AlteredArg {
    const items = this.#listeners.get(event);

    if (items?.length) {
      for (const {cb} of items) {
        value = cb.call(callThis, value, ...args);
      }
    }

    return value as unknown as AlteredArg;
  }

  /**
   * Trigger an event, async listener alter given value and return it.
   * @param event
   * @param value
   * @param args
   * @param callThis
   */
  async asyncAlter<Arg = unknown, AlteredArg = Arg>(
    event: string,
    value: Arg,
    args: unknown[] = [],
    callThis: unknown = null
  ): Promise<AlteredArg> {
    const items = this.#listeners.get(event);

    if (items?.length) {
      for (const item of items) {
        value = await item.cb.call(callThis, value, ...args);
      }
    }

    return value as unknown as AlteredArg;
  }

  destroy() {
    this.#listeners.clear();
  }
}

export const hooks = new Hooks();
export const $on: typeof hooks.on = hooks.on.bind(hooks);
export const $once: typeof hooks.once = hooks.once.bind(hooks);
export const $off: typeof hooks.off = hooks.off.bind(hooks);
export const $emit: typeof hooks.emit = hooks.emit.bind(hooks);
export const $asyncEmit: typeof hooks.asyncEmit = hooks.asyncEmit.bind(hooks);
export const $alter: typeof hooks.alter = hooks.alter.bind(hooks);
export const $asyncAlter: typeof hooks.asyncAlter = hooks.asyncAlter.bind(hooks);
