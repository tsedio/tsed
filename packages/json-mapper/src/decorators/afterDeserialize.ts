import {JsonEntityFn, JsonHookContext} from "@tsed/schema";

export interface AfterDeserializeCallback {
  (value: any, ctx: JsonHookContext): any;
}

/**
 * Call the function after JsonMapper.
 *
 * ## Example
 *
 * ```typescript
 * @AfterDeserialize((data: Model) => { // After deserialize get the instance class
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
export function AfterDeserialize(cb: AfterDeserializeCallback): ClassDecorator {
  return JsonEntityFn((storedJson) => {
    storedJson.schema.$hooks.on("afterDeserialize", cb);
  });
}
