import {DecoratorParameters} from "../types/DecoratorParameters.js";
import {descriptorOf} from "./descriptorOf.js";

/**
 * Constructs decorator parameters (target, propertyKey, descriptor) for a given class member.
 *
 * Retrieves the property descriptor and returns a tuple compatible with decorator signatures.
 *
 * @public
 * @since v7.0.0
 * @see DecoratorParameters
 * @see descriptorOf
 */
export function decoratorArgs(target: any, propertyKey: string): DecoratorParameters {
  return [target, propertyKey, descriptorOf(target, propertyKey)!];
}
