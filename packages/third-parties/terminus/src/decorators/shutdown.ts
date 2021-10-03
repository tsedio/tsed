import {Store} from "@tsed/core";

function register(name: string) {
  return <Function>(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) => {
    if (descriptor.value) {
      const store = Store.from(target);
      const values = store.get(name) || [];

      store.merge(name, [...values, descriptor.value]);
    }
  };
}

/**
 * Listen the `beforeShutdown` terminus event.
 *
 * @decorator
 * @terminus
 */
export function BeforeShutdown(): MethodDecorator {
  return register("beforeShutdown");
}

/**
 * Listen the `onSignal` terminus event.
 *
 * @decorator
 * @terminus
 */
export function OnSignal(): MethodDecorator {
  return register("onSignal");
}

/**
 * Listen the `onShutdown` terminus event.
 *
 * @decorator
 * @terminus
 */
export function OnShutdown(): MethodDecorator {
  return register("onShutdown");
}

/**
 * Listen the `onSendFailureDuringShutdown` terminus event.
 *
 * @decorator
 * @terminus
 */
export function OnSendFailureDuringShutdown(): MethodDecorator {
  return register("onSendFailureDuringShutdown");
}
