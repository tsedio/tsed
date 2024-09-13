import {Hooks} from "@tsed/core";

/**
 * Resolve the groups according to the options. Return true if the schema must be filtered.
 *
 * @ignore
 * @param schema
 * @param options
 */
export function alterGroups(schema: {$hooks: Hooks}, options: any) {
  if (options.groups !== false) {
    return schema?.$hooks?.alter("groups", false, [options.groups]);
  }
}
