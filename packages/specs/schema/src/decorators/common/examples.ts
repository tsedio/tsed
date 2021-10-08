import {OpenSpecHash, OpenSpecRef, OS3Example} from "@tsed/openspec";
import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {JsonEntityFn} from "./jsonEntityFn";

/**
 * Add a examples metadata on the decorated element.
 *
 * @decorator
 * @swagger
 * @schema
 * @input
 * @methodDecorator
 * @classDecorator
 */
export function Examples(examples: OpenSpecHash<OS3Example | OpenSpecRef>): ParameterDecorator {
  return JsonEntityFn((store: JsonEntityStore) => {
    store.parameter!.examples(examples);
  });
}
