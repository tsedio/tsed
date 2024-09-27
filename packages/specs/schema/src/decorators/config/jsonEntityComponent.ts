import type {DecoratorTypes, Type} from "@tsed/core";

import type {JsonEntityStore} from "../../domain/JsonEntityStore.js";
import {JsonEntitiesContainer} from "../../domain/JsonEntityStore.js";

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
