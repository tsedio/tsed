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
  return (target: any, propertyKey: string | symbol) => {
    decorators.filter(Boolean).forEach((decorator) => decorator(target, propertyKey, descriptorOf(target, propertyKey)));
  };
}
