import {Hooks} from "@tsed/core";

/**
 * @ignore
 * @param schema
 * @param options
 */
export function alterIgnore(schema: {$hooks: Hooks}, options: any) {
  let result = schema?.$hooks?.alter("ignore", false, [options]);

  if (result) {
    return result;
  }

  if (options.groups !== false) {
    return schema?.$hooks?.alter("groups", false, [options.groups]);
  }

  return result;
}
