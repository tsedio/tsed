import {OpenSpecHash, OpenSpecRef, OS3Example} from "@tsed/openspec";
import {JsonParameterStore} from "../../domain/JsonParameterStore";
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
  return JsonEntityFn((store: JsonParameterStore) => {
    store.parameter!.examples(examples);
  });
}
