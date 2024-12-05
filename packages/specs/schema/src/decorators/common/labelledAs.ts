import {JsonEntityFn} from "./jsonEntityFn.js";

/**
 * Use label to create ref on the current decorated property.
 *
 * ### Example
 *
 * ```ts
 * class Model {
 *   // For single property
 *   ＠LabelledAs("UserSchema")
 *   name: string;
 *
 *   // For collection
 *   ＠LabelledAs("UserCollectionSchema", "collection")
 *   users: User[];
 * }
 * ```
 *
 * @param label The name of the label
 * @param includeCollection Add the label to the collection. By default, the label is added to the item of the collection it the property is a collection.
 * @returns PropertyDecorator
 *
 * @decorator
 */
export function LabelledAs(label: string, includeCollection: false | "collection" = false): PropertyDecorator {
  return JsonEntityFn((entity) => {
    if (includeCollection) {
      entity.schema.label(label);
    } else {
      entity.itemSchema.label(label);
    }
  });
}
