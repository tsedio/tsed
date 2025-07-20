import {JsonEntityStore} from "../../domain/JsonEntityStore.js";

/**
 * Define generics list. This list is used by @@GenericOf@@ and the @@getJsonSchema@@ function to build the correct JsonSchema.
 *
 * See @@GenericOf@@ decorator for more details.
 *
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @input
 * @generics
 * @param genericLabels
 */
export function Generics(...genericLabels: string[]): ClassDecorator {
  return (target: any) => {
    const storedSchema = JsonEntityStore.from(target);

    storedSchema.schema.genericLabels(genericLabels);
  };
}
