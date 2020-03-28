import {Hooks} from "@tsed/core";

export function alterIgnore(schema: {$hooks: Hooks}, options: any) {
  return schema?.$hooks?.alter("ignore", false, [options]);
}
