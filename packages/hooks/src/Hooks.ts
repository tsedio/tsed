/**
 * A reference that can be used to identify and manage hook listeners.
 *
 * This type allows various kinds of values to be used as references when registering
 * hook listeners, enabling flexible listener management and targeted event emission.
 *
 * @public
 */
export type HookRef = string | symbol | any | Function;

/**
 * A function that handles hook events.
 *
 * Hook listeners are invoked when their associated event is emitted or altered,
 * receiving the event arguments as parameters.
 *
 * @public
 */
export type HookListener = Function;

type HookItem = {cb: HookListener; ref?: HookRef};

function match(ref: HookRef | unknown[] | undefined, item: HookItem) {
  return !ref || !item.ref || (ref && item.ref === ref);
}

const EMPTY_ARGS: unknown[] = [];

// Same as `cb.call(callThis, value, ...args)`, without the spread for the usual 0 and 1 extra argument cases.
// `args` is read on every call, as the spread did.
function callAlter(cb: HookListener, callThis: unknown, value: unknown, args: unknown[]) {
  switch (args.length) {
    case 0:
      return cb.call(callThis, value);
    case 1:
      return cb.call(callThis, value, args[0]);
    default:
      return cb.call(callThis, value, ...args);
  }
}

/**
 * A lightweight event management system for registering, emitting, and managing hook listeners.
 *
 * The Hooks class provides a flexible event system that supports:
 * - Registering listeners with optional references for targeted management
 * - One-time event listeners
 * - Synchronous and asynchronous event emission
 * - Value transformation through alter hooks
 * - Listener removal by callback or reference
 *
 * ### Usage
 *
 * ```typescript
 * const hooks = new Hooks();
 *
 * // Register a listener
 * hooks.on("user:created", (user) => {
 *   console.log("User created:", user);
 * });
 *
 * // Emit an event
 * hooks.emit("user:created", [{name: "John"}]);
 *
 * // Alter a value through hooks
 * const modified = hooks.alter("transform:data", {value: 10}, []);
 * ```
 *
 * @public
 */
export class Hooks {
  #listeners: Map<string, HookItem[]> = new Map();

  /**
   * Check if an event has registered listeners.
   *
   * @param event - The event name to check
   * @returns `true` if the event has at least one listener, `false` otherwise
   */
  has(event: string) {
    return !!this.#listeners.get(event)?.length;
  }

  /**
   * Register a listener for a hook event with an optional reference.
   *
   * The reference can be used later to remove all listeners associated with it,
   * or to emit events targeting only listeners with a specific reference.
   *
   * ### Usage
   *
   * ```typescript
   * // Register a listener without reference
   * hooks.on("user:created", (user) => {
   *   console.log("User created:", user);
   * });
   *
   * // Register a listener with reference
   * hooks.on("user:created", MyController, (user) => {
   *   console.log("Controller notified:", user);
   * });
   * ```
   *
   * @param event - The event name to listen to
   * @param ref - Optional reference to associate with this listener
   * @param cb - The callback function to invoke when the event is emitted
   * @returns The Hooks instance for method chaining
   */
  on(event: string, ref: HookRef, cb: HookListener): this;
  /**
   * Register a listener for a hook event.
   *
   * @param event - The event name to listen to
   * @param cb - The callback function to invoke when the event is emitted
   * @returns The Hooks instance for method chaining
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
   * Register a one-time listener for a hook event with an optional reference.
   *
   * The listener will be automatically removed after being invoked once.
   * This is useful for handling events that should only trigger a single action.
   *
   * ### Usage
   *
   * ```typescript
   * // Listen once without reference
   * hooks.once("app:ready", () => {
   *   console.log("App is ready!");
   * });
   *
   * // Listen once with reference
   * hooks.once("initialization:complete", MyService, () => {
   *   console.log("Service initialized");
   * });
   * ```
   *
   * @param event - The event name to listen to
   * @param ref - Optional reference to associate with this listener
   * @param cb - The callback function to invoke when the event is emitted
   * @returns The Hooks instance for method chaining
   */
  once(event: string, ref: HookRef, cb: HookListener): this;
  /**
   * Register a one-time listener for a hook event.
   *
   * The listener will be automatically removed after being invoked once.
   *
   * @param event - The event name to listen to
   * @param cb - The callback function to invoke when the event is emitted
   * @returns The Hooks instance for method chaining
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
   * Remove all listeners associated with a specific reference.
   *
   * This will remove all listeners across all events that were registered
   * with the given reference, regardless of the event name.
   *
   * ### Usage
   *
   * ```typescript
   * // Register listeners with a reference
   * hooks.on("event1", MyController, callback1);
   * hooks.on("event2", MyController, callback2);
   *
   * // Remove all listeners for MyController
   * hooks.off(MyController);
   * ```
   *
   * @param ref - The reference to remove all associated listeners
   * @returns The Hooks instance for method chaining
   */
  off(ref: HookRef): this;
  /**
   * Remove a specific listener from an event.
   *
   * This will only remove the exact callback function from the specified event.
   *
   * ### Usage
   *
   * ```typescript
   * const callback = (data) => console.log(data);
   * hooks.on("my:event", callback);
   *
   * // Remove the specific callback
   * hooks.off("my:event", callback);
   * ```
   *
   * @param event - The event name
   * @param cb - The callback function to remove
   * @returns The Hooks instance for method chaining
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
   * Trigger an event and invoke all registered listeners synchronously.
   *
   * This method calls all listeners registered for the specified event without any arguments.
   *
   * ### Usage
   *
   * ```typescript
   * hooks.on("app:started", () => console.log("App started"));
   * hooks.emit("app:started");
   * ```
   *
   * @param event - The event name to emit
   */
  emit(event: string): void;
  /**
   * Trigger an event and invoke all registered listeners with arguments.
   *
   * All listeners for the event will be called synchronously with the provided arguments.
   *
   * ### Usage
   *
   * ```typescript
   * hooks.on("user:created", (user, timestamp) => {
   *   console.log("User created:", user, "at", timestamp);
   * });
   *
   * hooks.emit("user:created", [{name: "John"}, Date.now()]);
   * ```
   *
   * @param event - The event name to emit
   * @param args - Array of arguments to pass to the listeners
   */
  emit(event: string, args: unknown[]): void;
  /**
   * Trigger an event and invoke only listeners attached to a specific reference.
   *
   * This allows targeted event emission to listeners registered with a particular reference,
   * while ignoring listeners without that reference.
   *
   * ### Usage
   *
   * ```typescript
   * hooks.on("data:update", MyController, (data) => {
   *   console.log("Controller notified:", data);
   * });
   *
   * // Only triggers listeners with MyController reference
   * hooks.emit("data:update", MyController, [{id: 1}]);
   * ```
   *
   * @param event - The event name to emit
   * @param ref - The reference to target specific listeners
   * @param args - Optional array of arguments to pass to the listeners
   */
  emit(event: string, ref: HookRef, args?: unknown[]): void;
  emit(event: string, ref?: HookRef | unknown[], args?: unknown[]): void {
    if (Array.isArray(ref)) {
      args = ref;
      ref = undefined;
    }

    const items = this.#listeners.get(event);

    if (items?.length) {
      // apply() with undefined args calls the listener without arguments, like an empty array
      for (const item of items) {
        if (match(ref, item)) {
          item.cb.apply(null, args);
        }
      }
    }
  }

  /**
   * Trigger an event and invoke all registered listeners asynchronously.
   *
   * All listeners are called in parallel and the method waits for all promises to resolve.
   * This is useful when listeners perform async operations like database queries or API calls.
   *
   * ### Usage
   *
   * ```typescript
   * hooks.on("user:created", async (user) => {
   *   await sendWelcomeEmail(user);
   * });
   *
   * await hooks.asyncEmit("user:created");
   * ```
   *
   * @param event - The event name to emit
   * @returns A promise that resolves when all listeners have completed
   */
  async asyncEmit(event: string): Promise<void>;
  /**
   * Trigger an event and invoke all registered listeners asynchronously with arguments.
   *
   * All listeners are called in parallel with the provided arguments,
   * and the method waits for all promises to resolve.
   *
   * ### Usage
   *
   * ```typescript
   * hooks.on("order:created", async (order, userId) => {
   *   await notifyUser(userId, order);
   * });
   *
   * await hooks.asyncEmit("order:created", [orderData, 123]);
   * ```
   *
   * @param event - The event name to emit
   * @param args - Array of arguments to pass to the listeners
   * @returns A promise that resolves when all listeners have completed
   */
  async asyncEmit(event: string, args: unknown[]): Promise<void>;
  /**
   * Trigger an event asynchronously for listeners with a specific reference.
   *
   * Only listeners registered with the specified reference will be invoked.
   * All matching listeners are called in parallel.
   *
   * ### Usage
   *
   * ```typescript
   * hooks.on("data:sync", MyService, async (data) => {
   *   await syncToDatabase(data);
   * });
   *
   * await hooks.asyncEmit("data:sync", MyService, [newData]);
   * ```
   *
   * @param event - The event name to emit
   * @param ref - The reference to target specific listeners
   * @param args - Optional array of arguments to pass to the listeners
   * @returns A promise that resolves when all listeners have completed
   */
  async asyncEmit(event: string, ref: HookRef, args?: unknown[]): Promise<void>;
  async asyncEmit(event: string, ref?: HookRef | unknown[], args?: unknown[]): Promise<void> {
    if (Array.isArray(ref)) {
      args = ref;
      ref = undefined;
    }

    const items = this.#listeners.get(event);

    if (items?.length) {
      let promises: PromiseLike<unknown>[] | undefined;
      // the length is read once: a listener added by another listener is not called, as with the filter() snapshot
      const length = items.length;

      for (let i = 0; i < length; i++) {
        const item = items[i];

        if (match(ref, item)) {
          const result = item.cb.apply(null, args);

          // Promise.all() ignores the values that are not thenables: only wait for the others
          if (result && typeof result.then === "function") {
            (promises ||= []).push(result);
          }
        }
      }

      if (promises) {
        await Promise.all(promises);
      }
    }
  }

  /**
   * Transform a value by passing it through all registered listeners sequentially.
   *
   * Each listener receives the value (potentially modified by previous listeners) and returns
   * a new or modified value. The final transformed value is returned after all listeners
   * have been applied. This is useful for implementing middleware-like transformation chains.
   *
   * ### Usage
   *
   * ```typescript
   * hooks.on("format:name", (name) => name.trim());
   * hooks.on("format:name", (name) => name.toUpperCase());
   *
   * const result = hooks.alter("format:name", "  john  ");
   * // result: "JOHN"
   * ```
   *
   * @typeParam Arg - The type of the input value
   * @typeParam AlteredArg - The type of the returned value (can be different from input)
   * @param event - The event name
   * @param value - The initial value to transform
   * @param args - Additional arguments passed to each listener
   * @param callThis - The context (`this`) to use when calling listeners
   * @returns The final transformed value after all listeners have been applied
   */
  alter<Arg = unknown, AlteredArg = Arg>(event: string, value: Arg, args: unknown[] = EMPTY_ARGS, callThis: unknown = null): AlteredArg {
    const items = this.#listeners.get(event);

    if (items?.length) {
      for (const {cb} of items) {
        value = callAlter(cb, callThis, value, args) as Arg;
      }
    }

    return value as unknown as AlteredArg;
  }

  /**
   * Transform a value asynchronously by passing it through all registered listeners sequentially.
   *
   * Similar to `alter`, but each listener can be async and is awaited before the next listener
   * is called. The value is transformed sequentially through the chain of async listeners.
   * This is useful for async transformation pipelines like data validation, sanitization, or enrichment.
   *
   * ### Usage
   *
   * ```typescript
   * hooks.on("process:data", async (data) => {
   *   return await validateData(data);
   * });
   *
   * hooks.on("process:data", async (data) => {
   *   return await enrichData(data);
   * });
   *
   * const result = await hooks.asyncAlter("process:data", rawData);
   * // result: enriched and validated data
   * ```
   *
   * @typeParam Arg - The type of the input value
   * @typeParam AlteredArg - The type of the returned value (can be different from input)
   * @param event - The event name
   * @param value - The initial value to transform
   * @param args - Additional arguments passed to each listener
   * @param callThis - The context (`this`) to use when calling listeners
   * @returns A promise resolving to the final transformed value after all listeners have been applied
   */
  async asyncAlter<Arg = unknown, AlteredArg = Arg>(
    event: string,
    value: Arg,
    args: unknown[] = EMPTY_ARGS,
    callThis: unknown = null
  ): Promise<AlteredArg> {
    const items = this.#listeners.get(event);

    if (items?.length) {
      for (const item of items) {
        value = await callAlter(item.cb, callThis, value, args);
      }
    }

    return value as unknown as AlteredArg;
  }

  /**
   * Remove all registered listeners and clean up the hooks instance.
   *
   * This method clears all event listeners from the instance, effectively resetting it
   * to an empty state. Useful for cleanup operations, testing, or when disposing of
   * a Hooks instance.
   *
   * ### Usage
   *
   * ```typescript
   * const hooks = new Hooks();
   * hooks.on("event1", callback1);
   * hooks.on("event2", callback2);
   *
   * hooks.destroy();
   * // All listeners are now removed
   * ```
   */
  destroy() {
    this.#listeners.clear();
  }
}

/**
 * Global singleton instance of the Hooks class.
 *
 * This instance provides a centralized event management system that can be used
 * throughout an application without needing to create and pass around separate
 * Hooks instances.
 *
 * ### Usage
 *
 * ```typescript
 * import {hooks} from "@tsed/hooks";
 *
 * hooks.on("app:started", () => {
 *   console.log("Application started");
 * });
 *
 * hooks.emit("app:started", []);
 * ```
 *
 * @public
 */
export const hooks = new Hooks();

/**
 * Functional helper to register a hook listener on the global hooks instance.
 *
 * This is a convenience function bound to the global `hooks.on` method,
 * allowing for a more concise functional programming style.
 *
 * @public
 * @see {@link Hooks.on}
 */
export const $on: typeof hooks.on = hooks.on.bind(hooks);

/**
 * Functional helper to register a one-time hook listener on the global hooks instance.
 *
 * This is a convenience function bound to the global `hooks.once` method.
 * The listener will be automatically removed after being invoked once.
 *
 * @public
 * @see {@link Hooks.once}
 */
export const $once: typeof hooks.once = hooks.once.bind(hooks);

/**
 * Functional helper to remove hook listeners from the global hooks instance.
 *
 * This is a convenience function bound to the global `hooks.off` method,
 * supporting removal by event name and callback, or by reference.
 *
 * @public
 * @see {@link Hooks.off}
 */
export const $off: typeof hooks.off = hooks.off.bind(hooks);

/**
 * Functional helper to emit synchronous events on the global hooks instance.
 *
 * This is a convenience function bound to the global `hooks.emit` method,
 * triggering all registered listeners for the specified event.
 *
 * @public
 * @see {@link Hooks.emit}
 */
export const $emit: typeof hooks.emit = hooks.emit.bind(hooks);

/**
 * Functional helper to emit asynchronous events on the global hooks instance.
 *
 * This is a convenience function bound to the global `hooks.asyncEmit` method,
 * awaiting all listener promises in parallel.
 *
 * @public
 * @see {@link Hooks.asyncEmit}
 */
export const $asyncEmit: typeof hooks.asyncEmit = hooks.asyncEmit.bind(hooks);

/**
 * Functional helper to alter values through synchronous hooks on the global hooks instance.
 *
 * This is a convenience function bound to the global `hooks.alter` method,
 * allowing listeners to transform a value sequentially.
 *
 * @public
 * @see {@link Hooks.alter}
 */
export const $alter: typeof hooks.alter = hooks.alter.bind(hooks);

/**
 * Functional helper to alter values through asynchronous hooks on the global hooks instance.
 *
 * This is a convenience function bound to the global `hooks.asyncAlter` method,
 * allowing async listeners to transform a value sequentially.
 *
 * @public
 * @see {@link Hooks.asyncAlter}
 */
export const $asyncAlter: typeof hooks.asyncAlter = hooks.asyncAlter.bind(hooks);
