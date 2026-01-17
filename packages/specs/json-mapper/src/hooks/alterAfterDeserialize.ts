import type {Hooks} from "@tsed/hooks";

/**
 * Trigger the `afterDeserialize` lifecycle in order to finalize instances after mapping.
 */
export function alterAfterDeserialize(data: any, schema: {$hooks: Hooks}, options: any) {
  return schema?.$hooks?.alter("afterDeserialize", data, [options]);
}
