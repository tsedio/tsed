import {Groups} from "../common/groups";

/**
 * Apply Partial group strategy on the input model
 *
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 */
export function Partial(): ParameterDecorator {
  return Groups("partial") as any;
}
