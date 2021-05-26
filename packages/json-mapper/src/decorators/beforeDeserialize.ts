import {JsonEntityFn, JsonHookContext} from "@tsed/schema";

export interface BeforeDeserializeCallback {
  (value: any, ctx: JsonHookContext): any;
}

/**
 * Call the function before JsonMapper.
 *
 * ## Example
 *
 * ```typescript
 * @BeforeDeserialize((data: Record<string, unknown>) => { // Before deserialize get the data
 *    if (data.prop1 === 'VALUE' && data.prop2 !== 'VALUE2') {
 *      throw BadRequest('MyMessage'); // or throw a ValidationError
 *    } else {
 *      data.prop2 = 'VALUE2';
 *      return data;
 *    }
 * })
 * class Model {
 *    @Property()
 *    prop1: string;
 *    @Property()
 *    prop2: string;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @schema
 * @property
 * @param cb
 */
export function BeforeDeserialize(cb: BeforeDeserializeCallback): ClassDecorator {
  return JsonEntityFn((storedJson) => {
    storedJson.schema.$hooks.on("beforeDeserialize", cb);
  });
}
