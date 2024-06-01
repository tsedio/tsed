import {JsonEntityFn} from "./jsonEntityFn.js";

/**
 * Allow to forward group on specific property.
 *
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 */
export function ForwardGroups(bool = true): PropertyDecorator {
  return JsonEntityFn((entity) => {
    entity.schema.$forwardGroups = bool;
  });
}
