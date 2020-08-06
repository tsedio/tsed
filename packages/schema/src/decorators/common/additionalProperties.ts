import {JsonEntityFn} from "./jsonEntityFn";
/**
 * Accept unknown properties on the deserialized model.
 *
 * ::: warning
 * This decorator will be removed in v7.
 * For v6 user, use @@AdditionalProperties@@ from @tsed/schema instead of @tsed/common.
 * :::
 *
 * @param bool
 * @decorator
 * @validation
 * @swagger
 * @schema
 */
export function AdditionalProperties(bool: boolean) {
  return JsonEntityFn((entity, parameters) => {
    entity.itemSchema.additionalProperties(bool);
  });
}
