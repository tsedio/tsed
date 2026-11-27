import {AnyDecorator} from "../types/AnyDecorator.js";
import {descriptorOf} from "./descriptorOf.js";

/**
 * Wraps a decorator to ensure it receives the proper method descriptor.
 *
 * @public
 * @since v7.0.0
 */
export function useMethodDecorator(decorator: AnyDecorator) {
  return (target: any, propertyKey: string | symbol) => decorator(target, propertyKey, descriptorOf(target, propertyKey));
}

/**
 * Combines multiple method decorators into a single decorator with proper descriptor handling.
 *
 * @public
 * @since v7.0.0
 */
export function useMethodDecorators(...decorators: AnyDecorator[]) {
  // filtered once, when the decorators are combined, instead of on each application (startup cost, cold starts)
  const list = decorators.filter(Boolean);

  return (target: any, propertyKey: string | symbol) => {
    list.forEach((decorator) => decorator(target, propertyKey, descriptorOf(target, propertyKey)));
  };
}
