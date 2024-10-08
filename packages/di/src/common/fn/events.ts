import {injector} from "./injector.js";

/**
 * Alter value attached to an event asynchronously.
 * @param eventName
 * @param value
 * @param args
 * @param callThis
 */
export function $alterAsync<T = any>(eventName: string, value: any, ...args: unknown[]) {
  return injector().hooks.asyncAlter<T>(eventName, value, args);
}

/**
 * Emit an event to all service. See service [lifecycle hooks](/docs/services.md#lifecycle-hooks).
 * @param eventName The event name to emit at all services.
 * @param args List of the parameters to give to each service.
 * @returns A list of promises.
 */
export function $emit(eventName: string, ...args: unknown[]): Promise<void> {
  return injector().hooks.asyncEmit(eventName, args);
}

/**
 * Alter value attached to an event.
 * @param eventName
 * @param value
 * @param args
 * @param callThis
 */
export function $alter<T = any>(eventName: string, value: unknown, ...args: unknown[]): T {
  return injector().hooks.alter(eventName, value, args);
}
