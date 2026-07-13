import {DecoratorTypes, Type} from "@tsed/core";

import {JsonEntitiesContainer, JsonEntityStore} from "../../domain/index.js";

/**
 * Declare a new JsonEntityStore class for a specific decorator type.
 *
 * @ignore
 * @param type
 * @decorator
 * @deprecated
 */
export function JsonEntityComponent(type: DecoratorTypes) {
  return (target: Type<JsonEntityStore>) => {
    JsonEntitiesContainer.set(type, target);
  };
}
