import {getJsonType as get} from "@tsed/schema";

/**
 * Get json type of the give value.
 *
 * ::: warning
 * Will be remove in v7 in favor of getJsonType from @tsed/schema.
 * :::
 */
export function getJsonType(value: any): string {
  return get(value);
}
