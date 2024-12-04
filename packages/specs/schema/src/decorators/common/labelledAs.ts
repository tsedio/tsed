import {JsonEntityFn} from "./jsonEntityFn.js";

/**
 * Use label to create ref on the current decorated property.
 * @param name The name of the label
 * @param includeCollection Add the label to the collection. By default, the label is added to the item of the collection it the property is a collection.
 * @decorator
 */
export function LabelledAs(name: string, includeCollection: false | "collection" = false): PropertyDecorator {
  return JsonEntityFn((entity) => {
    if (includeCollection) {
      entity.schema.label(name);
    } else {
      entity.itemSchema.label(name);
    }
  });
}
