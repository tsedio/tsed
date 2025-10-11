import {isClass, Type} from "@tsed/core";

import {JsonSchema} from "../domain/JsonSchema.js";
import {getJsonEntityStore} from "../utils/getJsonEntityStore.js";
/**
 * Create a new model from the given type.
 *
 * ```typescript
 * from(String)
 * ```
 *
 *  * See @@JsonSchema@@ to discover available methods.
 *
 * @schemaFunctional
 */
import type {CtorToType, SchemaShape, TypedChain} from "./types.js";

export function from<TC extends Type<any> = Type<any>>(): SchemaShape<CtorToType<ObjectConstructor>> &
  JsonSchema &
  TypedChain<CtorToType<ObjectConstructor>>;
export function from<TC extends Type<any> = Type<any>>(type?: TC): SchemaShape<CtorToType<TC>> & JsonSchema & TypedChain<CtorToType<TC>>;
export function from(type: Type<any> = Object) {
  if (isClass(type)) {
    const {schema} = getJsonEntityStore(type);

    schema.properties = function properties(obj: {[key: string]: JsonSchema}) {
      Object.entries(obj).forEach(([propertyKey, propSchema]) => {
        getJsonEntityStore(type.prototype, propertyKey).schema.assign(propSchema);
      });

      return this;
    };

    return schema;
  }

  return JsonSchema.from({type});
}
