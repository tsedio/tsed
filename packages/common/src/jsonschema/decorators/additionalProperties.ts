import {AdditionalProperties as A} from "@tsed/schema";
import {JSONSchema6} from "json-schema";

/**
 * Accept unknown properties on the deserialized model.
 *
 * ::: warning
 * For v6 user, use @@AdditionalProperties@@ from @tsed/schema instead of @tsed/common.
 * :::
 *
 * @param value
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @ignore
 * @deprecated Use @AdditionalProperties decorator from @tsed/schema instead of.
 */
export function AdditionalProperties(value: boolean | JSONSchema6) {
  return A(value as any);
}
