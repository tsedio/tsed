import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {JsonEntityFn} from "./jsonEntityFn";

/**
 * Add a example metadata on the decorated element.
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
