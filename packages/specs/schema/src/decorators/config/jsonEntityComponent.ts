import {DecoratorTypes, Type} from "@tsed/core";

import {JsonEntityStore} from "../../domain/index.js";
import {defineStore} from "../../registries/JsonEntitiesContainer.js";

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
    defineStore(type, target);
  };
}
