import type {Hooks} from "@tsed/hooks";

/**
 * Trigger the `beforeDeserialize` hooks declared on the schema to massage raw payloads
 * prior to property mapping.
 */
export function alterBeforeDeserialize(data: any, schema: {$hooks: Hooks}, options: any) {
  return schema?.$hooks?.alter("beforeDeserialize", data, [options]);
}
