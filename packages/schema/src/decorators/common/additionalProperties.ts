import {JsonEntityFn} from "./jsonEntityFn";
/**
 * Accept unknown properties on the deserialized model
 * @param bool
 * @constructor
 */
export function AdditionalProperties(bool: boolean) {
  return JsonEntityFn((entity, parameters) => {
    entity.itemSchema.additionalProperties(bool);
  });
}
