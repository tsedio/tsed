import {JsonEntityFn, JsonHookContext} from "@tsed/schema";

export interface OnDeserializeCallback {
  (value: any, ctx: JsonHookContext): any;
}

/**
 * Call the function before property deserialization.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @OnDeserialize(v => v + 1)
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
export function OnDeserialize(cb: OnDeserializeCallback): PropertyDecorator {
  return JsonEntityFn((storedJson) => {
    storedJson.schema.$hooks.on("onDeserialize", cb);
  });
}
