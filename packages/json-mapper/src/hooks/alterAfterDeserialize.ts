import {Hooks} from "@tsed/core";

export function alterAfterDeserialize(data: any, schema: {$hooks: Hooks}, options: any) {
  return schema?.$hooks?.alter("afterDeserialize", data, [options]);
}
