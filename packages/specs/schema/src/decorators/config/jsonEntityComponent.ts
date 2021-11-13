import {DecoratorTypes, Type} from "@tsed/core";
import {JsonEntityStore, JsonEntitiesContainer} from "../../domain/JsonEntityStore";

/**
 * Declare a new JsonEntityStore class for a specific decorator type.
 *
 * @ignore
 * @param type
 * @decorator
 */
export function JsonEntityComponent(type: DecoratorTypes) {
  return (target: Type<JsonEntityStore>) => {
    JsonEntitiesContainer.set(type, target);
  };
}
