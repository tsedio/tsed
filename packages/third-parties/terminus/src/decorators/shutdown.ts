export function register(event: string) {
  return <Function>(target: Object, propertyKey: string, description: PropertyDescriptor) => {
    Object.defineProperty(target, `$${event}`, {
      value: description.value
    });
  };
}

/**
 * Listen the `beforeShutdown` terminus event.
 *
 * @decorator
 * @terminus
 * @deprecated Use $BeforeShutdown hook
 */
export function BeforeShutdown(): MethodDecorator {
  return register("beforeShutdown");
}

/**
 * Listen the `onSignal` terminus event.
 *
 * @decorator
 * @terminus
 * @deprecated Use $onSignal hook
 */
export function OnSignal(): MethodDecorator {
  return register("onSignal");
}

/**
 * Listen the `onShutdown` terminus event.
 *
 * @decorator
 * @terminus
 * @deprecated Use $onShutdown hook
 */
export function OnShutdown(): MethodDecorator {
  return register("onShutdown");
}

/**
 * Listen the `onSendFailureDuringShutdown` terminus event.
 *
 * @decorator
 * @terminus
 * @deprecated Use $onSendFailureDuringShutdown hook
 */
export function OnSendFailureDuringShutdown(): MethodDecorator {
  return register("OnSendFailureDuringShutdown");
}
