import {JsonEntityStore} from "../../domain/JsonEntityStore.js";
import {JsonEntityFn} from "./jsonEntityFn.js";

/**
 * Add an example metadata on the decorated element.
 *
 * @decorator
 * @swagger
 * @schema
 * @input
 * @methodDecorator
 * @classDecorator
 */
export function Example(...examples: any[]): Function {
  return JsonEntityFn((store: JsonEntityStore) => {
    store.schema.examples(examples);
  });
}
