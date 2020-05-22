import {JsonHookContext, JsonSchemaStoreFn} from "@tsed/schema";

export interface OnSerializeCallback {
  (value: any, ctx: JsonHookContext): any;
}

/**
 * Call the function before property serialization.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @OnSerialize(v => v + 1)
 *    property: string;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @schema
 * @property
 * @param cb
 */
export function OnSerialize(cb: OnSerializeCallback): PropertyDecorator {
  return JsonSchemaStoreFn(storedJson => {
    storedJson.itemSchema.$hooks.on("onSerialize", cb);
  });
}
