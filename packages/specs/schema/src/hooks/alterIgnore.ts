import {isBoolean} from "@tsed/core";
import type {Hooks} from "@tsed/hooks";

/**
 * @ignore
 * @param schema
 * @param options
 */
export function alterIgnore(schema: {$hooks: Hooks; $ignore: boolean | Function}, options: any) {
  if (isBoolean(schema.$ignore) && schema.$ignore) {
    return true;
  }

  let result = schema?.$hooks?.alter("ignore", false, [options]);

  if (result) {
    return result;
  }

  if (options.groups !== false) {
    return schema?.$hooks?.alter("groups", false, [options.groups]);
  }

  return result;
}
