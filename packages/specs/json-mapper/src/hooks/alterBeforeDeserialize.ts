import type {Hooks} from "@tsed/hooks";

export function alterBeforeDeserialize(data: any, schema: {$hooks: Hooks}, options: any) {
  return schema?.$hooks?.alter("beforeDeserialize", data, [options]);
}
