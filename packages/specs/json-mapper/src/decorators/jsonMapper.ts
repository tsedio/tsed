import {Type} from "@tsed/core";

import {registerJsonTypeMapper} from "../domain/JsonMapperTypesContainer.js";

/**
 * Register a class as the mapper responsible for the given primitive/class tokens.
 * The decorator instantiates the mapper and stores it inside the JSON mapper types container.
 *
 * ### Example
 *
 * ```ts
 * @JsonMapper(MyCustomType)
 * export class MyCustomTypeMapper implements JsonMapperMethods {
 *   serialize() {/* ... *\/}
 *   deserialize() {/* ... *\/}
 * }
 * ```
 *
 * @param types One or more constructors/symbols handled by the mapper.
 */
export function JsonMapper(...types: (any | Type)[]): ClassDecorator {
  return (target) => {
    types.forEach((type) => {
      registerJsonTypeMapper(type, target as any);
    });
  };
}
