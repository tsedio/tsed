import type {Hooks} from "@tsed/hooks";

export function alterAfterDeserialize(data: any, schema: {$hooks: Hooks}, options: any) {
  return schema?.$hooks?.alter("afterDeserialize", data, [options]);
}
