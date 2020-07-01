import {Type} from "@tsed/core";
import {getJsonSchema as get} from "@tsed/schema";
import {JSONSchema6} from "json-schema";

/**
 * Get json schema of the given model.
 *
 * ::: warning
 * Will be remove in v7 in favor of getJsonSchema from @tsed/schema.
 * :::
 *
 * @param target
 */
export function getJsonSchema(target: Type<any>): JSONSchema6 {
  return get(target);
}
