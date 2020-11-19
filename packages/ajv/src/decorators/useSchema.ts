import {Schema} from "@tsed/schema";
import {JSONSchema6} from "json-schema";

/**
 * Use raw JsonSchema to validate parameter.
 *
 * ::: warning
 * This decorator will be removed in v7.
 * For v6 user, @@UseSchema@@ can be replaced by @@Schema@@ from @tsed/schema.
 * :::
 *
 * @param schema
 * @deprecated Since v6. Use @Schema from @tsed/schema.
 */
export function UseSchema(schema: JSONSchema6) {
  return Schema(schema);
}
