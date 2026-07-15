import {isClass, Type} from "@tsed/core";

import {getJsonEntityStore} from "../domain/JsonEntitiesContainer.js";
import {JsonSchema} from "../domain/JsonSchema.js";
import type {CtorToType} from "../domain/types.js";

/**
 * Create a new local schema instance from the given type.
 *
 * When the input is a class, `from()` returns a cloned `JsonSchema` that can be
 * composed safely without mutating the schema stored on the class metadata.
 * This makes `from()` the functional entry point for schema composition.
 *
 * Use @@get@@ when you intentionally need the shared class schema in order to
 * patch or extend the metadata attached to a class definition.
 *
 * ```typescript
 * from(String)
 * from(UserModel).description("Local description")
 * ```
 *
 * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
export function from<TC extends Type<any> = Type<any>>(): JsonSchema<CtorToType<ObjectConstructor>>;
export function from<TC extends Type<any> = Type<any>>(type?: TC): JsonSchema<CtorToType<TC>>;
export function from(type: Type<any> = Object) {
  if (isClass(type)) {
    const {schema} = getJsonEntityStore(type);

    return schema.clone();
  }

  return new JsonSchema({type});
}

/**
 * Get the shared schema instance attached to a class.
 *
 * Contrary to @@from@@, `get()` returns the schema stored in the class metadata.
 * Mutating the returned instance updates the class-level schema definition and
 * therefore affects every consumer of that class schema.
 *
 * This helper is intended for low-level or internal patching scenarios where the
 * source schema must be updated in place.
 *
 * ```typescript
 * get(UserModel).properties({
 *   name: string()
 * });
 * ```
 *
 * @param type The class owning the shared schema metadata.
 * @returns The shared `JsonSchema` instance for the class.
 */
export function get(type: Type<any>) {
  const {schema} = getJsonEntityStore(type);

  schema.properties = function properties(obj: {[key: string]: JsonSchema}) {
    Object.entries(obj).forEach(([propertyKey, propSchema]) => {
      getJsonEntityStore(type.prototype, propertyKey).schema.assign(propSchema);
    });

    return this;
  };

  return schema;
}
