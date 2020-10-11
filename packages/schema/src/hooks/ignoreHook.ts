import {Hooks} from "@tsed/core";

/**
 * @ignore
 * @param schema
 * @param options
 */
export function alterIgnore(schema: {$hooks: Hooks}, options: any) {
  return schema?.$hooks?.alter("ignore", false, [options]);
}
