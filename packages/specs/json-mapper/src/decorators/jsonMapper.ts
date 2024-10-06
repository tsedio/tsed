import {Type} from "@tsed/core";

import {registerJsonTypeMapper} from "../domain/JsonMapperTypesContainer.js";

/**
 * Register a new JsonMapper Type
 * @param types
 * @constructor
 */
export function JsonMapper(...types: (any | Type)[]): ClassDecorator {
  return (target) => {
    types.forEach((type) => {
      registerJsonTypeMapper(type, target as any);
    });
  };
}
